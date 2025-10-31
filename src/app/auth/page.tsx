"use client"
import { useState } from 'react'
import { z } from 'zod'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Field, Input } from '@/components/Field'
import { signInEmail, signUpEmail, signInGoogle } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input')
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') await signInEmail(email, password)
      else await signUpEmail(email, password)
      router.push('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    setLoading(true)
    try {
      await signInGoogle()
      router.push('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Google sign-in error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div className="flex items-center gap-2">
        <button className={`btn ${mode === 'login' ? 'btn-teal' : 'btn-outline'}`} onClick={() => setMode('login')} aria-pressed={mode==='login'}>Login</button>
        <button className={`btn ${mode === 'register' ? 'btn-teal' : 'btn-outline'}`} onClick={() => setMode('register')} aria-pressed={mode==='register'}>Register</button>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Email" id="email">
            <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" id="password">
            <Input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </Field>
          {error && <div role="alert" className="text-sm text-red-700">{error}</div>}
          <div className="flex gap-3">
            <Button type="submit" className="btn-primary" disabled={loading}>{mode === 'login' ? 'Log in' : 'Create account'}</Button>
            <Button type="button" variant="teal" onClick={handleGoogle} disabled={loading}>Continue with Google</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
