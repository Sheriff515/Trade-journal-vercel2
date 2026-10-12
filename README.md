# Narrative First – Trade Journal (Vercel + Firebase)

Static site (no build step). Google sign-in and your data live in Firebase (Auth + Firestore), so nothing depends on one browser.

## 1. Firebase (free Spark plan is enough)
1. console.firebase.google.com > Add project.
2. Build > Authentication > Get started > Sign-in method > enable **Google**.
3. Build > Firestore Database > Create database (production mode, any region near you).
4. Firestore > Rules tab > paste the contents of `firestore.rules` > Publish. This makes each account readable only by its owner.
5. Project settings > Your apps > Web (`</>`) > register app. Copy the config object into `firebase-config.js`.

## 2. Deploy on Vercel
1. Push this folder to a GitHub repo (or run `npx vercel` inside it).
2. Vercel > Add New Project > import the repo. Framework preset: **Other**. No build command, no output directory. Deploy.
3. Copy your Vercel domain (e.g. `my-journal.vercel.app`).
4. Firebase > Authentication > Settings > **Authorized domains** > add that domain. (Without this, Google sign-in fails.)

Open the site, sign in with Google, done. Data syncs across devices and is cached offline.

## Notes
- The Firebase config values are not secrets; the Firestore rules are what protect your data.
- Reminders fire only while the page is open.
- Data layout: `users/{uid}/data/main` (rules, checks, reviews) and `users/{uid}/years/{YYYY}` (trades per year).
