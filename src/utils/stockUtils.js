// GVR Pharma IMS — Stock Utilities
import COLORS from '../constants/colors';

/** Minimum stock level before a medicine is flagged as "Low Stock" */
export const LOW_STOCK_THRESHOLD = 20;

/** Stock level for "Out of Stock" */
export const OUT_OF_STOCK_THRESHOLD = 0;

/**
 * Stock status types
 */
export const STOCK_STATUS = {
  IN_STOCK:     'in_stock',
  LOW_STOCK:    'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

/**
 * Returns the stock status string for a given quantity.
 * @param {number} stock
 * @returns {'in_stock' | 'low_stock' | 'out_of_stock'}
 */
export const getStockStatus = (stock) => {
  if (stock === OUT_OF_STOCK_THRESHOLD) return STOCK_STATUS.OUT_OF_STOCK;
  if (stock < LOW_STOCK_THRESHOLD)     return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
};

/**
 * Returns the display color for a stock level.
 * @param {number} stock
 * @returns {string} hex color
 */
export const getStockColor = (stock) => {
  const status = getStockStatus(stock);
  switch (status) {
    case STOCK_STATUS.OUT_OF_STOCK: return COLORS.danger;
    case STOCK_STATUS.LOW_STOCK:    return COLORS.warning;
    default:                        return COLORS.success;
  }
};

/**
 * Returns a human-readable stock status label.
 * @param {number} stock
 * @returns {string}
 */
export const getStockLabel = (stock) => {
  const status = getStockStatus(stock);
  switch (status) {
    case STOCK_STATUS.OUT_OF_STOCK: return 'Out of Stock';
    case STOCK_STATUS.LOW_STOCK:    return 'Low Stock';
    default:                        return 'In Stock';
  }
};
