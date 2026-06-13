// GVR Pharma IMS — Redux Store
import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './slices/authSlice';
import medicinesReducer from './slices/medicinesSlice';
import alertsReducer    from './slices/alertsSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    medicines: medicinesReducer,
    alerts:    alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable Firestore Timestamps in medicine docs
        ignoredActions: [
          'medicines/setMedicines',
          'medicines/addMedicine',
          'medicines/updateMedicine',
        ],
        ignoredPaths: [
          'medicines.medicines',
          'medicines.lastUpdated',
        ],
      },
    }),
});

export default store;
