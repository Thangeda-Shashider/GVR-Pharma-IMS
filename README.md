# GVR Pharma IMS — Setup Guide

Complete step-by-step instructions to get the app running.

---

## Prerequisites

- Node.js 18+ installed
- npm 9+ or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- A Firebase project (Google account required)

---

## Step 1 — Install Dependencies

```bash
cd GVR_Internship
npm install
```

Expected output: `added XXX packages in Xs`

---

## Step 2 — Firebase Project Setup

### 2.1 Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → Name it `gvr-pharma-ims`
3. Disable Google Analytics (optional) → **Create project**

### 2.2 Enable Authentication

1. In Firebase console → **Authentication** → **Get started**
2. Click **Sign-in method** → Enable **Email/Password**
3. Click **Save**

### 2.3 Create Firestore Database

1. **Firestore Database** → **Create database**
2. Choose **Start in test mode** (allows all reads/writes for 30 days)
3. Select a region closest to your users → **Done**

### 2.4 Register a Web App

1. **Project Overview** → **Add app** → Web icon (`</>`)
2. App nickname: `GVR Pharma IMS Web`
3. Click **Register app**
4. Copy the `firebaseConfig` object shown — you'll need it in Step 3

### 2.5 Create Admin User

1. **Authentication** → **Users** → **Add user**
2. Enter email (e.g. `admin@gvrpharma.com`) and a strong password
3. Note the **User UID** shown in the Users table

### 2.6 Create the User Document in Firestore

1. **Firestore Database** → **Start collection** → Collection ID: `users`
2. Document ID: paste the UID from Step 2.5
3. Add these fields:
   ```
   name:      "Admin User"      (string)
   email:     "admin@gvrpharma.com"  (string)
   role:      "admin"           (string)
   createdAt: (timestamp)       (use serverTimestamp or current date)
   ```
4. Click **Save**

---

## Step 3 — Configure Firebase in the App

Open `src/config/firebase.js` and replace the placeholder config:

```js
const firebaseConfig = {
  apiKey:            "YOUR_REAL_API_KEY",
  authDomain:        "gvr-pharma-ims.firebaseapp.com",
  projectId:         "gvr-pharma-ims",
  storageBucket:     "gvr-pharma-ims.appspot.com",
  messagingSenderId: "YOUR_REAL_SENDER_ID",
  appId:             "YOUR_REAL_APP_ID"
};
```

---

## Step 4 — Seed Sample Data (First Time Only)

To populate Firestore with the 10 sample medicines, temporarily add this to `DashboardScreen.js` (or any screen):

```js
import { seedFirestore } from '../../config/seedFirestore';

// Inside any useEffect or button handler (run once only):
const result = await seedFirestore();
console.log(result); // { success: true, count: 10 }
```

After running once and confirming data is in Firestore, **remove the call** to avoid duplicates.

Alternatively, manually add medicines through the app once logged in as admin.

---

## Step 5 — Run the App

```bash
npx expo start
```

This opens the Expo Dev Tools. Then:

- **Android emulator**: Press `a` in the terminal, or scan QR code with **Expo Go** app
- **iOS simulator**: Press `i` in the terminal (macOS only)
- **Physical device**: Install **Expo Go** from Play Store / App Store, scan QR code

---

## Step 6 — First Login

1. Use the admin credentials you created in Step 2.5
2. On success, you'll land on the Dashboard
3. Admin has full CRUD access — add, edit, delete medicines

---

## Folder Structure Quick Reference

```
GVR_Internship/
├── App.js                         ← Root entry point
├── src/
│   ├── config/
│   │   ├── firebase.js            ← Firebase init (edit this)
│   │   ├── seedData.js            ← Sample medicines data
│   │   └── seedFirestore.js       ← One-shot seed helper
│   ├── constants/
│   │   ├── colors.js              ← Brand color palette
│   │   └── roles.js               ← Permission definitions
│   ├── utils/
│   │   ├── dateUtils.js           ← Expiry helpers
│   │   └── stockUtils.js          ← Stock status helpers
│   ├── store/
│   │   ├── index.js               ← Redux store
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── medicinesSlice.js
│   │       └── alertsSlice.js
│   ├── navigation/
│   │   ├── AppNavigator.js        ← Root navigator
│   │   ├── AuthNavigator.js       ← Splash + Login
│   │   └── MainNavigator.js       ← Bottom tabs
│   ├── components/
│   │   ├── StatCard.js
│   │   ├── MedicineCard.js
│   │   ├── AlertItem.js
│   │   ├── SearchBar.js
│   │   └── LoadingSpinner.js
│   ├── hooks/
│   │   ├── useMedicines.js        ← Firestore real-time listener
│   │   └── useAlerts.js           ← Derives alert arrays
│   └── screens/
│       ├── auth/
│       │   ├── SplashScreen.js
│       │   └── LoginScreen.js
│       ├── dashboard/
│       │   └── DashboardScreen.js
│       ├── medicines/
│       │   ├── MedicineListScreen.js
│       │   ├── MedicineDetailScreen.js
│       │   └── AddEditMedicineScreen.js
│       ├── alerts/
│       │   └── AlertsScreen.js
│       └── profile/
│           └── ProfileScreen.js
```

---

## Role Reference

| Role    | Add | Edit | Delete | View Alerts |
|---------|-----|------|--------|-------------|
| admin   | ✅  | ✅   | ✅     | ✅          |
| manager | ❌  | ❌   | ❌     | ✅          |
| sales   | ❌  | ❌   | ❌     | ❌          |

> The Alerts tab is hidden from `sales` users entirely.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Firebase: Error (auth/invalid-credential)` | Check API key in `firebase.js` |
| App stuck on Splash | Check internet connection and Firebase config |
| Medicines not loading | Verify Firestore is in test mode and `db` is initialized |
| `Unable to resolve module` | Run `npm install` again |
| Expo Go version mismatch | Update Expo Go app on your device |

---

*GVR Pharma IMS — Built with Expo + Firebase + Redux Toolkit*
