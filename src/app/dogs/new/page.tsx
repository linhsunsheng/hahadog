"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { useAuth } from '@/lib/useAuth'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { Field, Input, Select } from '@/components/Field'
import { allBreedOptions, type BreedKey } from '@/lib/breeds'

export default function NewDogPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => { if (!loading && !user) router.replace('/auth') }, [user, loading, router])

  const [nickname, setNickname] = useState('')
  const [birthday, setBirthday] = useState('')
  const [breedKey, setBreedKey] = useState<BreedKey>('corgi')
  const [neuter, setNeuter] = useState<'neutered'|'intact'>('neutered')
  const [activity, setActivity] = useState<'low'|'normal'|'high'>('normal')
  const [saving, setSaving] = useState(false)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const col = collection(firestore(), 'users', user.uid, 'dogs')
      const doc = await addDoc(col, {
        nickname,
        birthday: birthday || null,
        breedKey,
        neuter,
        activity,
        weightKg: null,
        goal: 'maintain',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      router.push(`/dogs/${doc.id}`)
    } finally { setSaving(false) }
  }

  if (!user) return null

  const breeds = allBreedOptions()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">New Dog Profile</h1>
      <Card>
        <form onSubmit={onCreate} className="grid gap-4">
          <Field label="Nickname" id="nickname"><Input id="nickname" value={nickname} onChange={(e)=>setNickname(e.target.value)} required /></Field>
          <Field label="Birthday" id="birthday"><Input id="birthday" type="date" value={birthday} onChange={(e)=>setBirthday(e.target.value)} /></Field>
          <Field label="Breed" id="breed">
            <Select id="breed" value={breedKey} onChange={(e)=>setBreedKey(e.target.value as BreedKey)}>
              {breeds.map((b)=> <option value={b.key} key={b.key}>{b.label}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Neuter status" id="neuter">
              <Select id="neuter" value={neuter} onChange={(e)=>setNeuter(e.target.value as 'neutered'|'intact')}>
                <option value="neutered">Neutered</option>
                <option value="intact">Intact</option>
              </Select>
            </Field>
            <Field label="Activity level" id="activity">
              <Select id="activity" value={activity} onChange={(e)=>setActivity(e.target.value as any)}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </Select>
            </Field>
          </div>
          <div className="mt-2 flex gap-3">
            <Button type="submit" className="btn-primary" disabled={saving}>Create Dog Profile</Button>
            <Button type="button" variant="outline" onClick={()=>router.back()}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
