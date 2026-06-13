// GVR Pharma IMS — Date Utilities

/** Number of days before expiry to trigger an "Expiring Soon" warning */
export const EXPIRY_WARNING_DAYS = 90;

/**
 * Returns the number of days from today until the given expiry date.
 * Returns a negative number if the date has already passed.
 * @param {string} expiryDateString — format "YYYY-MM-DD"
 * @returns {number}
 */
export const daysUntilExpiry = (expiryDateString) => {
  if (!expiryDateString) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateString);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Formats an expiry date string as "MMM YYYY" (e.g. "Jun 2027").
 * @param {string} expiryDateString — format "YYYY-MM-DD"
 * @returns {string}
 */
export const formatExpiry = (expiryDateString) => {
  if (!expiryDateString) return 'N/A';
  const date = new Date(expiryDateString);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

/**
 * Returns true if the medicine expires within EXPIRY_WARNING_DAYS from today,
 * or has already expired.
 * @param {string} expiryDateString — format "YYYY-MM-DD"
 * @returns {boolean}
 */
export const isExpiringSoon = (expiryDateString) => {
  const days = daysUntilExpiry(expiryDateString);
  return days <= EXPIRY_WARNING_DAYS;
};

/**
 * Returns true if the medicine has already expired.
 * @param {string} expiryDateString — format "YYYY-MM-DD"
 * @returns {boolean}
 */
export const isExpired = (expiryDateString) => {
  return daysUntilExpiry(expiryDateString) < 0;
};

/**
 * Returns a human-readable label for the days until expiry.
 * e.g. "Expires in 14 days", "Expired 3 days ago", "Expiring today"
 * @param {string} expiryDateString
 * @returns {string}
 */
export const expiryLabel = (expiryDateString) => {
  const days = daysUntilExpiry(expiryDateString);
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Expiring today';
  return `Expires in ${days} day${days !== 1 ? 's' : ''}`;
};
