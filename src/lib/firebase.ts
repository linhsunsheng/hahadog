import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator as _connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator as _connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator as _connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connect to emulators only in DEV and only in the BROWSER
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    _connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    _connectFirestoreEmulator(db, "localhost", 8081);
    _connectStorageEmulator(storage, "localhost", 9199);
  } catch (e) {
    // no-op
  }
}

