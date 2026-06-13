// GVR Pharma IMS — useAlerts Hook
// Derives alert arrays from Redux medicines state and dispatches to alerts slice.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMedicines } from '../store/slices/medicinesSlice';
import {
  setAlerts,
  selectLowStock,
  selectExpiringSoon,
  selectOutOfStock,
  selectTotalAlerts,
} from '../store/slices/alertsSlice';
import { LOW_STOCK_THRESHOLD } from '../utils/stockUtils';
import { isExpiringSoon } from '../utils/dateUtils';

/**
 * Reads medicines from Redux, derives alert arrays, and dispatches setAlerts.
 *
 * @returns {{
 *   lowStock:       object[],
 *   outOfStock:     object[],
 *   expiringSoon:   object[],
 *   totalAlertCount: number
 * }}
 */
const useAlerts = () => {
  const dispatch   = useDispatch();
  const medicines  = useSelector(selectMedicines);
  const lowStock   = useSelector(selectLowStock);
  const expiring   = useSelector(selectExpiringSoon);
  const outOfStock = useSelector(selectOutOfStock);
  const totalAlertCount = useSelector(selectTotalAlerts);

  useEffect(() => {
    if (!medicines || medicines.length === 0) {
      dispatch(setAlerts({ lowStock: [], expiringSoon: [], outOfStock: [] }));
      return;
    }

    const outOfStockList   = medicines.filter((m) => m.stock === 0);
    const lowStockList     = medicines.filter((m) => m.stock > 0 && m.stock < LOW_STOCK_THRESHOLD);
    const expiringSoonList = medicines.filter((m) => isExpiringSoon(m.expiryDate));

    dispatch(setAlerts({
      lowStock:     lowStockList,
      expiringSoon: expiringSoonList,
      outOfStock:   outOfStockList,
    }));
  }, [medicines, dispatch]);

  return {
    lowStock,
    outOfStock,
    expiringSoon: expiring,
    totalAlertCount,
  };
};

export default useAlerts;
