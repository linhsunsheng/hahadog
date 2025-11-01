"use client"
import { useState, useMemo, Suspense } from 'react'
import { z } from 'zod'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Field, Input } from '@/components/Field'
import { signInEmail, signUpEmail, signInGoogle, sendPasswordReset } from '@/lib/auth'
import { useRouter, useSearchParams } from 'next/navigation'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

function AuthPageInner() {
  const searchParams = useSearchParams()
  const initialMode = useMemo<'login' | 'register'>(() => {
    const m = searchParams.get('mode')
    return m === 'register' ? 'register' : 'login'
  }, [searchParams])
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input')
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') await signInEmail(email, password)
      else await signUpEmail(email, password, name)
      router.push('/dashboard')
    } catch (e: any) {
      const code = e?.code as string | undefined
      if (code === 'auth/email-already-in-use') setError('An account already exists for this email. Please log in instead.')
      else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Incorrect email or password.')
      else setError(e?.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      await signInGoogle()
      router.push('/dashboard')
    } catch (e: any) {
      const code = e?.code as string | undefined
      if (code === 'auth/account-exists-with-different-credential' || code === 'auth/credential-already-in-use') {
        setError('An account already exists for this email with a different sign-in method. Log in with your email/password, then link Google from your profile.')
      } else {
        setError(e?.message || 'Google sign-in error')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    setError(null)
    setInfo(null)
    const parsed = schema.shape.email.safeParse(email)
    if (!parsed.success) {
      setError('Enter a valid email to reset your password.')
      return
    }
    setLoading(true)
    try {
      await sendPasswordReset(email)
      setInfo('Password reset email sent. Check your inbox.')
    } catch (e: any) {
      const code = e?.code as string | undefined
      if (code === 'auth/user-not-found') setError('No account found for this email.')
      else setError(e?.message || 'Could not send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <Card>
        <div className="relative mb-4 grid grid-cols-2 rounded-xl bg-white p-2 text-center text-sm font-medium border border-black/10">
          <div className={`absolute left-2 right-2 top-2 bottom-2 w-[calc(50%-0.25rem)] rounded-lg bg-peach-300 transition-transform ${mode==='login' ? 'translate-x-0' : 'translate-x-full'}`}></div>
          <button type="button" className={`z-10 py-2 ${mode==='login'?'text-brown-600':'text-brown-600/70'}`} onClick={()=>setMode('login')} aria-pressed={mode==='login'}>Log in</button>
          <button type="button" className={`z-10 py-2 ${mode==='register'?'text-brown-600':'text-brown-600/70'}`} onClick={()=>setMode('register')} aria-pressed={mode==='register'}>Sign up</button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode==='register' && (
            <Field label="Name" id="name">
              <Input id="name" name="name" type="text" autoComplete="name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </Field>
          )}
          <Field label="Email" id="email">
            <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </Field>
          <Field label="Password" id="password">
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                className="pr-24"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-black/10 px-3 py-1 text-xs text-brown-600 hover:bg-black/5"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
          {error && <div role="alert" className="text-sm text-red-700">{error}</div>}
          {info && <div role="status" className="text-sm text-green-700">{info}</div>}
          <div className="flex gap-3">
            <Button type="submit" className="btn-primary" disabled={loading}>{mode === 'login' ? 'Log in' : 'Sign up'}</Button>
            {mode === 'login' && (
              <Button type="button" variant="outline" onClick={handleResetPassword} disabled={loading}>Forgot password?</Button>
            )}
            <Button type="button" variant="teal" onClick={handleGoogle} disabled={loading}>
              <span className="mr-2 inline-block align-middle">
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true"><path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h147.1c-6.4 34.5-25.8 63.7-55 83.3v68h88.7c52-47.9 80.7-118.5 80.7-196.1z"/><path fill="#34A853" d="M272 544.3c73.6 0 135.3-24.4 180.3-66.6l-88.7-68c-24.6 16.5-56 26.3-91.6 26.3-70.4 0-130.1-47.5-151.6-111.3h-91.8v69.9C73.9 486.8 165.9 544.3 272 544.3z"/><path fill="#FBBC05" d="M120.4 324.7c-5.6-16.5-8.8-34.2-8.8-52.7s3.2-36.2 8.8-52.7v-69.9H28.6C10.3 150.5 0 187.2 0 225.3c0 38.1 10.3 74.8 28.6 106.1l91.8-69.9z"/><path fill="#EA4335" d="M272 107.7c39.9 0 75.9 13.7 104.2 40.6l78.2-78.2C406.6 24.7 345.6 0 272 0 165.9 0 73.9 57.5 28.6 144.6l91.8 69.9C141.9 155.2 201.6 107.7 272 107.7z"/></svg>
              </span>
              Continue with Google
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-black/60">Loading…</div>}>
      <AuthPageInner />
    </Suspense>
  )
}

