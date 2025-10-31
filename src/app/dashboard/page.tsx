"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import Card from '@/components/Card'
import Button from '@/components/Button'
import DogDoodle from '@/components/DogDoodle'
import { deriveAgeFromBirthday } from '@/lib/nutrition'

interface DogDoc {
  id: string
  nickname: string
  birthday?: string
  breedKey: string
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
      const userRef = doc(firestore(), 'users', user.uid)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, { email: user.email ?? '', createdAt: new Date() })
      }
      const col = collection(firestore(), 'users', user.uid, 'dogs')
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
        <Button href="/dogs/new" className="btn-teal">Create Dog Profile</Button>
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{d.nickname}</div>
                  <div className="text-sm text-black/60">{d.breedKey}</div>
                  {d.birthday ? (
                    <div className="text-xs text-black/50 mt-1">Age: {(() => { const a = deriveAgeFromBirthday(d.birthday); return `${a.years}y ${a.months}m`; })()}</div>
                  ) : null}
                </div>
                <Button href={`/dogs/${d.id}`} className="btn-outline">Open</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
