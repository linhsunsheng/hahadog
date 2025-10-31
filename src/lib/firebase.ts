/* Firebase initialization for client-side usage.
 * Reads configuration from environment variables and never hardcodes keys.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp
let auth: Auth
let db: Firestore
let googleProvider: GoogleAuthProvider

export function firebaseApp() {
  if (!app) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    }
    if (Object.values(config).some((v) => !v)) {
      // Helpful message during local dev
      console.warn('Firebase env vars are missing. Check .env.local')
    }
    app = getApps().length ? getApps()[0]! : initializeApp(config)
  }
  return app
}

export function firebaseAuth() {
  if (!auth) {
    auth = getAuth(firebaseApp())
  }
  return auth
}

export function firestore() {
  if (!db) {
    db = getFirestore(firebaseApp())
  }
  return db
}

export function googleAuthProvider() {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider()
  }
  return googleProvider
}

