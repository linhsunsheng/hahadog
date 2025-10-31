"use client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth, googleAuthProvider } from './firebase'

export async function signUpEmail(email: string, password: string) {
  const auth = firebaseAuth()
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInEmail(email: string, password: string) {
  const auth = firebaseAuth()
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInGoogle() {
  const auth = firebaseAuth()
  const provider = googleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  return cred.user
}

export async function signOut() {
  const auth = firebaseAuth()
  await fbSignOut(auth)
}

export function subscribeAuth(cb: (user: User | null) => void) {
  const auth = firebaseAuth()
  return onAuthStateChanged(auth, cb)
}

