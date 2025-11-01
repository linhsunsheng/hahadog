"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "./firebase";

export function onAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, cb);
}

export async function signUpEmail(email: string, password: string, name?: string) {
  const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (name) {
    try { await updateProfile(cred.user, { displayName: name }); } catch {}
  }
  return cred;
}

export async function signInEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function signInGoogle() {
  return signInWithPopup(firebaseAuth, googleProvider);
}

export async function signOut() {
  return fbSignOut(firebaseAuth);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(firebaseAuth, email);
}
