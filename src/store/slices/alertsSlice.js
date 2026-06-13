// GVR Pharma IMS — Alerts Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lowStock:     [],  // medicines with 0 < stock < LOW_STOCK_THRESHOLD
  expiringSoon: [],  // medicines expiring within EXPIRY_WARNING_DAYS
  outOfStock:   [],  // medicines with stock === 0
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    /**
     * Sets all three alert arrays at once.
     * payload: { lowStock: [], expiringSoon: [], outOfStock: [] }
     */
    setAlerts(state, action) {
      state.lowStock     = action.payload.lowStock     ?? [];
      state.expiringSoon = action.payload.expiringSoon ?? [];
      state.outOfStock   = action.payload.outOfStock   ?? [];
    },
    clearAlerts(state) {
      state.lowStock     = [];
      state.expiringSoon = [];
      state.outOfStock   = [];
    },
  },
});

export const { setAlerts, clearAlerts } = alertsSlice.actions;

// Selectors
export const selectLowStock     = (state) => state.alerts.lowStock;
export const selectExpiringSoon = (state) => state.alerts.expiringSoon;
export const selectOutOfStock   = (state) => state.alerts.outOfStock;
export const selectTotalAlerts  = (state) =>
  state.alerts.lowStock.length +
  state.alerts.expiringSoon.length +
  state.alerts.outOfStock.length;

export default alertsSlice.reducer;
