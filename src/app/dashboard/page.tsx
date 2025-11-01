"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, deleteDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import DogDoodle from '@/components/DogDoodle'
import ConfirmDialog from '@/components/ConfirmDialog'
import { deriveAgeFromBirthday } from '@/lib/nutrition'
import { deleteObject, ref } from 'firebase/storage'

interface DogDoc {
  id: string
  nickname: string
  birthday?: string
  weightKg?: number | null
  photoURL?: string | null
  breedKey?: string | null
  neuter: 'neutered' | 'intact'
  activity: 'low' | 'normal' | 'high'
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dogs, setDogs] = useState<DogDoc[] | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  useEffect(() => {
    async function load() {
      if (!user) return
      // Ensure user root doc exists for data model hygiene
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, { email: user.email ?? '', createdAt: new Date() })
      }
      const col = collection(db, 'users', user.uid, 'dogs')
      const snap = await getDocs(query(col, orderBy('createdAt', 'desc')))
      const items: DogDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      setDogs(items)
    }
    load()
  }, [user])

  const empty = useMemo(() => !dogs || dogs.length === 0, [dogs])

  if (!user) return null

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Dogs</h1>
        <Button href="/dogs/new" className="btn-teal">+ New dog</Button>
      </div>
      {empty ? (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Add your first dog</div>
              <p className="mt-1 text-black/70">Start by creating a dog profile. We’ll save it for quick reuse.</p>
              <Button href="/dogs/new" className="btn-primary mt-4">Create Dog Profile</Button>
            </div>
            <DogDoodle className="hidden h-24 w-48 sm:block" />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs!.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start gap-4">
                <Avatar src={d.photoURL || undefined} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-lg font-semibold">{d.nickname}</div>
                  <div className="text-sm text-black/60">
                    {d.breedKey ? `${d.breedKey}` : (d.birthday ? (()=>{const a=deriveAgeFromBirthday(d.birthday!); return `Age: ${a.years}y ${a.months}m`})() : '—')}
                    {typeof d.weightKg==='number' ? ` • ${d.weightKg} kg` : ''}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button href={`/dogs/${d.id}`} className="btn-outline">View / Edit</Button>
                    <ConfirmDialog title="Delete profile" message="This will delete the dog profile and photo."
                      onConfirm={async ()=>{
                        const docRef = doc(db,'users',user!.uid,'dogs',d.id)
                        await deleteDoc(docRef)
                        if (d.photoURL) {
                          try { await deleteObject(ref(storage, d.photoURL)) } catch {}
                        }
                        setDogs(prev=> prev? prev.filter(x=>x.id!==d.id):prev)
                      }}>
                      {(open)=> (<button onClick={open} className="btn btn-outline">Delete</button>)}
                    </ConfirmDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
