'use client';

import { useSearchParams } from 'next/navigation';
import { getTranslations, locales, defaultLocale } from '../translations';
import { useSelector } from 'react-redux';

/**
 * Custom hook to get translations based on the current locale
 * Prioritizes URL locale parameter, then Redux state, and falls back to default locale
 * @returns {object} The translation object for the current locale
 */
export function useTranslation() {
  const searchParams = useSearchParams();
  const urlLocale = searchParams?.get('locale');
  const reduxLocale = useSelector((state) => state.language?.language);
  
  // Determine which locale to use, with priority:
  // 1. URL parameter (if valid)
  // 2. Redux state (if valid)
  // 3. Default locale
  let currentLocale = defaultLocale;
  
  if (urlLocale && locales.includes(urlLocale)) {
    currentLocale = urlLocale;
  } else if (reduxLocale && locales.includes(reduxLocale)) {
    currentLocale = reduxLocale;
  }
  
  // Get translations for the determined locale
  const translations = getTranslations(currentLocale);
  
  return {
    t: translations,
    locale: currentLocale,
    isRTL: false // For future RTL language support
  };
} 