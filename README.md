<<<<<<< HEAD
# hahadog
Dog Food Calculator
=======
# Dog Daily — Nutrition targets for your dog

Web-first app built with Next.js (App Router) + TypeScript + Tailwind CSS + Firebase (Auth + Firestore).

Calculate science-based daily targets for calories, protein, fat, linoleic acid, calcium and phosphorus based on breed, age, activity, neuter status, and goals. Save profiles per dog.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS with custom theme (brown/teal/peach/yellow)
- Firebase Auth (Email/Password + Google) and Cloud Firestore

## Setup
1) Install dependencies
- Node.js 18+
- Install packages:
  - `npm install`

2) Environment
- Copy `.env.local.example` → `.env.local` and fill with your Firebase project keys:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

3) Dev server
- `npm run dev`
- Open `http://localhost:3000`

## Firebase Setup
1) Create a Firebase project and enable:
- Authentication: Email/Password + Google provider
- Firestore Database (production or test rules per your needs)

2) Data model
- `users/{uid}`: `{ email, createdAt }`
- `users/{uid}/dogs/{dogId}`: `{ nickname, birthday, breedKey, neuter, activity, weightKg, goal, createdAt, updatedAt }`

3) Deploy to Firebase Hosting
- This repo includes a `firebase.json` template configured for static export.
- Build + export: `npm run export`
- Initialize hosting: `firebase init hosting` (select your project, set `out` as public dir, single-page app: Yes)
- Deploy: `firebase deploy`

Note: For full SSR on Hosting, use the official Firebase Frameworks integration (`firebase frameworks:deploy`) or the Next.js Firebase adapter.

## Seeding data
- Register a user at `/auth`, then create a dog at `/dogs/new`.
- The app creates `users/{uid}` on first dashboard visit. No separate seed script is required.

## Calculator details
- RER = `70 * kg^0.75` (min kg = 1)
- Factors:
  - Puppies: small/medium 2.0×, large/giant 1.7×
  - Adult baseline: neutered 1.3×, intact 1.5×; low −0.1, high +0.2
  - Senior clamp to 1.1–1.3
  - Goals: lose 1.0×, gain 1.4×; uses ideal body weight for RER
- Nutrients per 1000 kcal:
  - Adult: protein 45 g, fat 13.8 g, linoleic 2.8 g, Ca 1.25 g, P 1.0 g
  - Growth: protein 56 g, fat 21 g, linoleic 2.8 g, Ca 3.0 g, P 2.5 g (DHA+EPA ~0.13 g noted)

## Accessibility
- Color contrasts validated for readability; form fields are labeled; keyboard-focusable controls. Aim for Lighthouse a11y ≥ 90.

## Data safety disclaimer
This app provides educational estimates only and does not replace veterinary advice. Always consult your veterinarian, especially for puppies, seniors, or dogs with medical conditions. Do not rely on this app for emergency situations.
>>>>>>> 603c0a3 (init: Next.js scaffold)
