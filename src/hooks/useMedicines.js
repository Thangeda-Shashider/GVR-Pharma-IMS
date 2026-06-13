// GVR Pharma IMS — useMedicines Hook
// Sets up a real-time Firestore onSnapshot listener and syncs to Redux.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  setMedicines,
  setLoading,
  setError,
  selectMedicines,
  selectMedLoading,
  selectMedError,
} from '../store/slices/medicinesSlice';

/**
 * Subscribes to the Firestore `medicines` collection in real time.
 * Dispatches setMedicines on every update.
 * Cleans up the listener on unmount.
 *
 * @returns {{ medicines: object[], loading: boolean, error: string|null }}
 */
const useMedicines = () => {
  const dispatch   = useDispatch();
  const medicines  = useSelector(selectMedicines);
  const loading    = useSelector(selectMedLoading);
  const error      = useSelector(selectMedError);

  useEffect(() => {
    dispatch(setLoading(true));

    const medicinesRef = collection(db, 'medicines');
    const q = query(medicinesRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamps to ISO strings for serializability
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? null,
        }));
        dispatch(setMedicines(docs));
      },
      (err) => {
        console.error('[useMedicines] Firestore error:', err);
        dispatch(setError(err.message));
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return { medicines, loading, error };
};

export default useMedicines;
