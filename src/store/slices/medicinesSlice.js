// GVR Pharma IMS — Medicines Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines:   [],
  loading:     false,
  error:       null,
  lastUpdated: null,
};

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    setMedicines(state, action) {
      state.medicines   = action.payload;
      state.loading     = false;
      state.error       = null;
      state.lastUpdated = Date.now();
    },
    addMedicine(state, action) {
      state.medicines.push(action.payload);
      state.lastUpdated = Date.now();
    },
    updateMedicine(state, action) {
      const index = state.medicines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.medicines[index] = action.payload;
        state.lastUpdated = Date.now();
      }
    },
    removeMedicine(state, action) {
      state.medicines   = state.medicines.filter((m) => m.id !== action.payload);
      state.lastUpdated = Date.now();
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error   = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setMedicines,
  addMedicine,
  updateMedicine,
  removeMedicine,
  setLoading,
  setError,
} = medicinesSlice.actions;

// Selectors
export const selectMedicines    = (state) => state.medicines.medicines;
export const selectMedLoading   = (state) => state.medicines.loading;
export const selectMedError     = (state) => state.medicines.error;
export const selectLastUpdated  = (state) => state.medicines.lastUpdated;
export const selectMedicineById = (id) => (state) =>
  state.medicines.medicines.find((m) => m.id === id);

export default medicinesSlice.reducer;
