"use client"
import { useEffect, useState } from 'react'
import { subscribeAuth } from './auth'
import type { User } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])
  return { user, loading }
}

