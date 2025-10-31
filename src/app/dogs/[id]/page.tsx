"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { useAuth } from '@/lib/useAuth'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Field, Input, Select } from '@/components/Field'
import DogDoodle from '@/components/DogDoodle'
import NutritionResults from '@/components/NutritionResults'
import { computeNutrition, deriveAgeFromBirthday, type Activity, type Goal, type Neuter } from '@/lib/nutrition'
import { BREEDS, type BreedKey } from '@/lib/breeds'

interface DogDoc {
  nickname: string
  birthday?: string | null
  breedKey: BreedKey
  neuter: Neuter
  activity: Activity
  weightKg?: number | null
  goal?: Goal
}

export default function DogDetailsPage() {
  const params = useParams<{ id: string }>()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dog, setDog] = useState<DogDoc | null>(null)
  const [ageY, setAgeY] = useState(0)
  const [ageM, setAgeM] = useState(0)
  const [weight, setWeight] = useState<number | ''>('')
  const [activity, setActivity] = useState<Activity>('normal')
  const [neuter, setNeuter] = useState<Neuter>('neutered')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [result, setResult] = useState<ReturnType<typeof computeNutrition> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!loading && !user) router.replace('/auth') }, [user, loading, router])

  useEffect(() => {
    async function load() {
      if (!user) return
      const ref = doc(firestore(), 'users', user.uid, 'dogs', params.id)
      const snap = await getDoc(ref)
      if (!snap.exists()) { router.replace('/dashboard'); return }
      const data = snap.data() as DogDoc
      setDog(data)
      const { years, months } = deriveAgeFromBirthday(data.birthday ?? undefined)
      setAgeY(years); setAgeM(months)
      setActivity(data.activity)
      setNeuter(data.neuter)
      setGoal((data.goal as Goal) || 'maintain')
      setWeight(typeof data.weightKg === 'number' ? data.weightKg : '')
    }
    load()
  }, [user, params.id, router])

  const breedLabel = useMemo(() => dog ? BREEDS[dog.breedKey].label : '', [dog])

  function recalc() {
    if (!dog || weight === '' || weight <= 0) { setResult(null); return }
    const res = computeNutrition({
      breed: dog.breedKey,
      weightKg: Number(weight),
      ageYears: ageY,
      ageMonths: ageM,
      activity,
      neuter,
      goal,
    })
    setResult(res)
  }

  async function saveDefaults() {
    if (!user || !dog) return
    setSaving(true)
    try {
      const ref = doc(firestore(), 'users', user.uid, 'dogs', params.id)
      await updateDoc(ref, {
        neuter,
        activity,
        goal,
        weightKg: weight === '' ? null : Number(weight),
        updatedAt: serverTimestamp(),
      })
    } finally { setSaving(false) }
  }

  useEffect(() => { recalc() }, [dog, weight, ageY, ageM, activity, neuter, goal])

  if (!user || !dog) return null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-black/60">{breedLabel}</div>
              <h1 className="text-2xl font-semibold">{dog.nickname}</h1>
            </div>
            <DogDoodle className="h-16 w-32" />
          </div>
        </Card>
        <Card>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age (years)" id="ageY"><Input id="ageY" type="number" min={0} value={ageY} onChange={(e)=>setAgeY(Number(e.target.value))} /></Field>
              <Field label="Age (months)" id="ageM"><Input id="ageM" type="number" min={0} max={11} value={ageM} onChange={(e)=>setAgeM(Number(e.target.value))} /></Field>
            </div>
            <Field label="Current weight (kg)" id="weight"><Input id="weight" type="number" step="0.1" min={1} value={weight} onChange={(e)=> setWeight(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Neuter status" id="neuter"><Select id="neuter" value={neuter} onChange={(e)=>setNeuter(e.target.value as Neuter)}><option value="neutered">Neutered</option><option value="intact">Intact</option></Select></Field>
              <Field label="Activity" id="activity"><Select id="activity" value={activity} onChange={(e)=>setActivity(e.target.value as Activity)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></Select></Field>
            </div>
            <Field label="Goal" id="goal"><Select id="goal" value={goal} onChange={(e)=>setGoal(e.target.value as Goal)}><option value="maintain">Maintain</option><option value="lose">Lose</option><option value="gain">Gain</option></Select></Field>
            <div className="flex gap-3">
              <Button type="button" className="btn-teal" onClick={recalc}>Recalculate</Button>
              <Button type="button" variant="outline" onClick={saveDefaults} disabled={saving}>Save defaults</Button>
            </div>
          </div>
        </Card>
      </div>
      <div>
        {result ? (
          <NutritionResults {...result} />
        ) : (
          <Card>
            <p className="text-black/70">Enter weight and confirm age to see daily targets.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
