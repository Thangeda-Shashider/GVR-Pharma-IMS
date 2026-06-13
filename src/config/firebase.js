/*
  FIREBASE SETUP INSTRUCTIONS
  ============================
  1. Go to https://console.firebase.google.com
  2. Create a new project named "gvr-pharma-ims"
  3. Enable Authentication → Sign-in method → Email/Password
  4. Create Firestore Database → Start in test mode
  5. Register a Web App → Copy the firebaseConfig object
  6. Replace the placeholder values in this file with your real config
  7. Create an admin user manually in Firebase Authentication console
  8. In Firestore, create the user's document in the "users" collection
     with their UID as the document ID and set role: "admin"
  9. Run seedFirestore.js once to populate sample medicine data
*/

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqEV7Q6LIgRp3h8WGaTtYoIHduGkUTWlM",
  authDomain: "gvr-pharma-ims.firebaseapp.com",
  projectId: "gvr-pharma-ims",
  storageBucket: "gvr-pharma-ims.firebasestorage.app",
  messagingSenderId: "1061569272668",
  appId: "1:1061569272668:web:8a4dfeaf8f92b41473bf99",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// initializeAuth with AsyncStorage persistence (React Native requirement).
// On hot reload, auth is already initialized — getAuth() returns the existing instance.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;
