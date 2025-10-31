"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'
import DogDoodle from './DogDoodle'

export default function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const onSignOut = async () => {
    await signOut()
    router.push('/auth')
  }
  return (
    <nav className="sticky top-0 z-40 border-b border-black/10 bg-[color:var(--color-brown-900)] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <DogDoodle className="h-6 w-10" />
          <span className="text-lg">Dog Daily</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className={`btn-outline hidden sm:inline-flex ${pathname?.startsWith('/dashboard') ? 'bg-white/10' : ''}`}>Dashboard</Link>
              <button onClick={onSignOut} className="btn-primary">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn-outline">Log in</Link>
              <Link href="/auth" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
