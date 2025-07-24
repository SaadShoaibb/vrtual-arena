import { translations } from '../translations';

/**
 * Format price with appropriate currency display based on locale
 * @param {number|string} price - The price to format
 * @param {string} locale - The current locale ('en' or 'fr')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, locale = 'en') => {
  const t = translations[locale] || translations.en;

  // Convert price to number and handle invalid values
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return locale === 'fr' ? '0,00 $ CAD' : '$0.00 CAD';
  }

  if (locale === 'fr') {
    // French Canadian format: "XX,XX $ CAD"
    return `${numPrice.toFixed(2).replace('.', ',')} $ CAD`;
  } else {
    // English Canadian format: "$XX.XX CAD"
    return `$${numPrice.toFixed(2)} CAD`;
  }
};

/**
 * Format price for display in components
 * @param {number|string} price - The price to format
 * @param {string} locale - The current locale ('en' or 'fr')
 * @param {boolean} showCurrency - Whether to show currency code (default: true)
 * @returns {string} - Formatted price string
 */
export const formatDisplayPrice = (price, locale = 'en', showCurrency = true) => {
  // Convert price to number and handle invalid values
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return showCurrency
      ? (locale === 'fr' ? '0,00 $ CAD' : '$0.00 CAD')
      : (locale === 'fr' ? '0,00 $' : '$0.00');
  }

  if (!showCurrency) {
    if (locale === 'fr') {
      return `${numPrice.toFixed(2).replace('.', ',')} $`;
    } else {
      return `$${numPrice.toFixed(2)}`;
    }
  }

  return formatPrice(price, locale);
};

/**
 * Get currency symbol based on locale
 * @param {string} locale - The current locale ('en' or 'fr')
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (locale = 'en') => {
  return '$';
};

/**
 * Get currency code
 * @returns {string} - Currency code
 */
export const getCurrencyCode = () => {
  return 'CAD';
};
