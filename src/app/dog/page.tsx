"use client"
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { useAuth } from '@/lib/useAuth'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Field, Input, Select } from '@/components/Field'
import NutritionResults from '@/components/NutritionResults'
import { computeNutrition, deriveAgeFromBirthday, type Activity, type Neuter } from '@/lib/nutrition'
import { allBreedOptions, type BreedKey } from '@/lib/breeds'
import Avatar from '@/components/Avatar'
import ConfirmDialog from '@/components/ConfirmDialog'
import { uploadDogPhoto } from '@/lib/upload'
import { deleteObject, ref } from 'firebase/storage'

interface DogDoc {
  nickname: string
  birthday?: string | null
  neuter: Neuter
  activity: Activity
  weightKg?: number | null
  goal?: any
  photoURL?: string | null
  locked?: boolean
  breedKey?: string | null
}

function DogDetailsInner() {
  const params = useSearchParams()
  const id = params.get('id') || ''
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dog, setDog] = useState<DogDoc | null>(null)
  const [ageY, setAgeY] = useState(0)
  const [ageM, setAgeM] = useState(0)
  const [weight, setWeight] = useState<number | ''>('')
  const [activity, setActivity] = useState<Activity>('normal')
  const [neuter, setNeuter] = useState<Neuter>('neutered')
  
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [locked, setLocked] = useState<boolean>(false)
  const [result, setResult] = useState<ReturnType<typeof computeNutrition> | null>(null)
  const [saving, setSaving] = useState(false)
  const [breedKey, setBreedKey] = useState<BreedKey | 'not_listed'>('mixed_medium')

  useEffect(() => { if (!loading && !user) router.replace('/auth') }, [user, loading, router])

  useEffect(() => {
    async function load() {
      if (!user || !id) return
      const refDoc = doc(db, 'users', user.uid, 'dogs', id)
      const snap = await getDoc(refDoc)
      if (!snap.exists()) { router.replace('/dashboard'); return }
      const data = snap.data() as DogDoc
      setDog(data)
      const { years, months } = deriveAgeFromBirthday(data.birthday ?? undefined)
      setAgeY(years); setAgeM(months)
      setActivity(data.activity)
      setNeuter(data.neuter)
      
      setWeight(typeof data.weightKg === 'number' ? data.weightKg : '')
      setPhotoURL(data.photoURL ?? null)
      setLocked(!!data.locked)
      setBreedKey((data.breedKey as any) || 'mixed_medium')
    }
    load()
  }, [user, id, router])

  const puppy = useMemo(()=> Boolean(dog?.birthday) && (ageY*12 + ageM) < 24, [dog, ageY, ageM])

  async function recalc() {
    if (!dog || weight === '' || weight <= 0) { setResult(null); return }
    const res = computeNutrition({
      breed: (breedKey === 'not_listed' ? 'mixed_medium' : breedKey) as BreedKey,
      weightKg: Number(weight),
      ageYears: ageY,
      ageMonths: ageM,
      activity,
      neuter,
    })
    setResult(res)
  }

  async function onSave() {
    if (!user || !id || !dog || weight === '' || weight <= 0) return
    setSaving(true)
    try {
      const refDog = doc(db, 'users', user.uid, 'dogs', id)
      const res = result ?? computeNutrition({
        breed: (breedKey === 'not_listed' ? 'mixed_medium' : breedKey) as BreedKey,
        weightKg: Number(weight),
        ageYears: ageY,
        ageMonths: ageM,
        activity,
        neuter,
      })
      const patch: any = { updatedAt: Date.now(), neuter, activity, goal: res.goal, weightKg: Number(weight) }
      if (!locked) {
        patch.nickname = dog.nickname
        patch.birthday = dog.birthday ?? null
        patch.breedKey = breedKey
        if (photo) {
          const up = await uploadDogPhoto(user.uid, id, photo)
          patch.photoURL = up.url
          setPhotoURL(up.url)
        }
      }
      await updateDoc(refDog, patch)
    } finally { setSaving(false) }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    if (!f) { setPhoto(null); return }
    if (!/^image\/(jpeg|png)$/i.test(f.type) || f.size > 2*1024*1024) { alert('Use JPEG/PNG <= 2MB'); return }
    setPhoto(f)
    setPhotoURL(URL.createObjectURL(f))
  }

  useEffect(() => {
    if (dog?.birthday) {
      const a = deriveAgeFromBirthday(dog.birthday)
      setAgeY(a.years); setAgeM(a.months)
    }
  }, [dog?.birthday])

  if (!user || !dog) return null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl bg-yellow-200 p-6 text-brown-600 shadow">
          <div className="flex flex-col items-center gap-2">
            <Avatar src={photoURL || undefined} size={96} />
            {false && (
              <div>
                <label className="label" htmlFor="photo">Replace photo</label>
                <input id="photo" name="photo" type="file" accept="image/jpeg,image/png" onChange={onFile} />
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nickname" id="nick"><Input id="nick" value={dog.nickname} disabled={locked} onChange={(e)=> setDog({ ...dog, nickname: e.target.value })} /></Field>
              <Field label="Birthday" id="bday"><Input id="bday" type="date" value={dog.birthday ?? ''} disabled={locked} onChange={(e)=> setDog({ ...dog, birthday: e.target.value })} /></Field>
            </div>
            <Field label="Breed" id="breed"><Select id="breed" value={breedKey} disabled={locked} onChange={(e)=> setBreedKey(e.target.value as any)}>
              {allBreedOptions().map((b)=> (<option key={b.key} value={b.key}>{b.label}</option>))}
              <option value="not_listed">Not on the list</option>
            </Select></Field>
            <Field label="Weight (kg)" id="weight"><Input id="weight" type="number" step="0.1" min={1} max={80} value={weight} onChange={(e)=> setWeight(e.target.value === '' ? '' : Number(e.target.value))} /><p className="mt-1 text-xs">Typical range 1-80 kg. Results may be inaccurate outside this range.</p></Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Neuter" id="neuter"><Select id="neuter" value={neuter} onChange={(e)=>setNeuter(e.target.value as Neuter)}><option value="neutered">Neutered</option><option value="intact">Intact</option></Select></Field>
              <Field label="Activity" id="activity"><Select id="activity" value={activity} onChange={(e)=>setActivity(e.target.value as Activity)}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></Select></Field>
              {/* Goal is derived automatically; no input required */}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" className="btn-primary" onClick={recalc} disabled={saving}>Calculate</Button>
              <Button type="button" className="btn-outline" onClick={onSave} disabled={saving}>Save Changes</Button>
              <ConfirmDialog title="Delete profile" message="This will permanently delete the profile and photo."
                onConfirm={async ()=>{
                  if (!user || !id) return
                  const refDog = doc(db,'users',user.uid,'dogs',id)
                  await deleteDoc(refDog)
                  if (photoURL) { try { await deleteObject(ref(storage, photoURL)) } catch {} }
                  router.push('/dashboard')
                }}>
                {(open)=> (<button onClick={open} className="btn btn-outline">Delete Profile</button>)}
              </ConfirmDialog>
            </div>
          </div>
        </div>
        
      </div>
      <div>
        {puppy && (
          <div role="alert" aria-live="polite" className="mb-4 rounded-xl border border-yellow-600/30 bg-yellow-100 p-3 text-sm text-yellow-900">Puppy detected (&lt;2 years). This calculator targets adult dogs; values may not be appropriate.</div>
        )}
        {result ? (<div className="rounded-2xl bg-peach-300 p-6 text-brown-600 shadow"><NutritionResults {...result} bare /></div>) : (
          <Card><p className="text-black/70">Enter weight and confirm age to see daily targets.</p></Card>
        )}
      </div>
    </div>
  )
}

export default function DogDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-black/60">Loading…</div>}>
      <DogDetailsInner />
    </Suspense>
  )
}
