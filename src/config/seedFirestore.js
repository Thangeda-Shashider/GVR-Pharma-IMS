// GVR Pharma IMS — Firestore Seed Helper
//
// HOW TO USE:
// -----------
// 1. Make sure your Firebase config is filled in (src/config/firebase.js).
// 2. Import and call `seedFirestore()` once from any dev screen or from
//    a temporary button in DashboardScreen during development.
// 3. Example:
//      import { seedFirestore } from '../config/seedFirestore';
//      // In a dev button press handler:
//      await seedFirestore();
// 4. After seeding, REMOVE the call — running it multiple times will
//    create duplicate documents.

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { sampleMedicines } from './seedData';

/**
 * Seeds the Firestore `medicines` collection with sampleMedicines data.
 * Call this ONCE during development to populate the database.
 * @returns {Promise<{ success: boolean, count: number, error?: string }>}
 */
export const seedFirestore = async () => {
  try {
    const medicinesRef = collection(db, 'medicines');
    let count = 0;

    for (const medicine of sampleMedicines) {
      await addDoc(medicinesRef, {
        ...medicine,
        createdAt:  serverTimestamp(),
        updatedAt:  serverTimestamp(),
      });
      count++;
      console.log(`[Seed] Added: ${medicine.name} (${count}/${sampleMedicines.length})`);
    }

    console.log(`[Seed] ✅ Successfully seeded ${count} medicines.`);
    return { success: true, count };
  } catch (error) {
    console.error('[Seed] ❌ Error seeding Firestore:', error);
    return { success: false, count: 0, error: error.message };
  }
};
