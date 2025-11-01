"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/useAuth'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Field, Input, Select } from '@/components/Field'
import Avatar from '@/components/Avatar'
import { deriveAgeFromBirthday, computeNutrition } from '@/lib/nutrition'
import { allBreedOptions, type BreedKey } from '@/lib/breeds'
import NutritionResults from '@/components/NutritionResults'

export default function NewDogPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !user) router.replace('/auth') }, [user, loading, router])

  const [nickname, setNickname] = useState('')
  const [birthday, setBirthday] = useState('')
  const [photoURL] = useState<string | null>(null)
  const [breedKey, setBreedKey] = useState<BreedKey | 'not_listed'>('mixed_medium')
  const [neuter, setNeuter] = useState<'neutered'|'intact'>('neutered')
  const [activity, setActivity] = useState<'low'|'normal'|'high'>('normal')
  
  const [weight, setWeight] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof computeNutrition> | null>(null)

  // Photo upload removed per request

  const age = useMemo(()=> deriveAgeFromBirthday(birthday || undefined), [birthday])
  const puppy = Boolean(birthday) && (age.years*12 + age.months) < 24
  const weightNum = Number(weight)
  const weightWarn = Number.isFinite(weightNum) && (weightNum < 1 || weightNum > 80)

  const [docId, setDocId] = useState<string | null>(null)
  async function onCalculate() {
    if (!user) return
    const w = Number(weight)
    if (!Number.isFinite(w) || w <= 0) { setResult(null); return }
    const res = computeNutrition({
      breed: (breedKey === 'not_listed' ? 'mixed_medium' : breedKey) as BreedKey,
      weightKg: w,
      ageYears: birthday ? age.years : 2,
      ageMonths: birthday ? age.months : 0,
      activity,
      neuter,
    })
    setResult(res)
    // Auto save or update profile
    const col = collection(db, 'users', user.uid, 'dogs')
    let r
    if (!docId) {
      r = doc(col)
      setDocId(r.id)
    } else {
      r = doc(col, docId)
    }
    await setDoc(r, {
      nickname,
      birthday,
      weightKg: Number(weight),
      breedKey,
      neuter,
      activity,
      goal: res.goal,
      photoURL: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      locked: true,
    }, { merge: true })
  }

  // No explicit Save; Calculate persists

  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <form onSubmit={(e)=>{e.preventDefault(); onCalculate();}} className="grid gap-4 rounded-2xl bg-yellow-200 p-6 text-brown-600 shadow">
          <div className="flex flex-col items-center gap-2">
            <Avatar src={photoURL || undefined} size={96} />
          </div>
          <Field label="Nickname" id="nickname"><Input id="nickname" value={nickname} onChange={(e)=>setNickname(e.target.value)} required /></Field>
          <Field label="Breed" id="breed">
            <Select id="breed" value={breedKey} onChange={(e)=> setBreedKey(e.target.value as any)}>
              {allBreedOptions().map((b)=> (
                <option key={b.key} value={b.key}>{b.label}</option>
              ))}
              <option value="not_listed">Not on the list</option>
            </Select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Birthday" id="birthday"><Input id="birthday" type="date" value={birthday} onChange={(e)=>setBirthday(e.target.value)} required /></Field>
            <Field label="Weight (kg)" id="weight"><Input id="weight" type="number" min={1} max={80} step={0.1} value={weight} onChange={(e)=>setWeight(e.target.value)} required /><p className="mt-1 text-xs">Typical range 1–80 kg. Results may be inaccurate outside this range.</p>{weightWarn && <p className="mt-1 text-xs text-red-700">Weight is outside typical range.</p>}</Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Neuter" id="neuter"><Select id="neuter" value={neuter} onChange={(e)=>setNeuter(e.target.value as any)}><option value="neutered">Neutered</option><option value="intact">Intact</option></Select></Field>
            <Field label="Activity" id="activity"><Select id="activity" value={activity} onChange={(e)=>setActivity(e.target.value as any)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></Select></Field>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="btn-primary" disabled={!nickname || !birthday || !weight || saving}>Calculate</Button>
          </div>
        </form>
      </Card>

      {puppy && (
        <div role="alert" aria-live="polite" className="mt-6 rounded-xl border border-yellow-600/30 bg-yellow-100 p-3 text-sm text-yellow-900">Puppy detected (&lt;2 years). This calculator targets adult dogs; values may not be appropriate.</div>
      )}

      {result && (
        <div className="mt-8 rounded-2xl bg-peach-300 p-6 text-brown-600 shadow">
          <NutritionResults {...result} bare />
        </div>
      )}
    </div>
  )
}
