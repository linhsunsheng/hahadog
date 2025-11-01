"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { signOut } from '@/lib/auth'

export default function Navbar() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const showBack = pathname?.startsWith('/dogs/')
  const onClick = async () => {
    if (user) {
      await signOut()
      router.push('/')
    } else {
      router.push('/auth?mode=login')
    }
  }
  return (
    <nav className="sticky top-0 z-40 bg-brown-900 text-white">
      <div className="relative mx-auto max-w-6xl px-4 py-6">
        {showBack && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button onClick={() => router.push('/dashboard')} className="btn-white transition-none">{'< Go back'}</button>
          </div>
        )}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-heading text-2xl font-extrabold uppercase tracking-wide">
            <Image src="/hahadog.svg" alt="Haha Dog logo" width={28} height={28} priority />
            <span>HAHA DOG!</span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClick} className="btn-yellow">{user ? 'Sign out' : 'Log in'}</button>
        </div>
      </div>
    </nav>
  )
}
