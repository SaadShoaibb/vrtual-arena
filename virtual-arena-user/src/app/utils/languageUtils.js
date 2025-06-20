'use client';

import { locales, defaultLocale } from '../translations';

/**
 * Get the URL for a specific locale while preserving the current path and other query parameters
 * @param {string} pathname - The current pathname
 * @param {URLSearchParams} searchParams - The current search parameters
 * @param {string} newLocale - The new locale to switch to
 * @returns {string} The new URL with updated locale
 */
export function getLocalizedUrl(pathname, searchParams, newLocale) {
  // Create a new URLSearchParams instance to avoid modifying the original
  const params = new URLSearchParams(searchParams);
  
  // Update the locale parameter
  params.set('locale', newLocale);
  
  // Build the new path with updated query parameters
  return `${pathname}?${params.toString()}`;
}

/**
 * Validate a locale string against available locales
 * @param {string} locale - The locale to validate
 * @returns {string} A valid locale or the default locale
 */
export function validateLocale(locale) {
  return locales.includes(locale) ? locale : defaultLocale;
}

/**
 * Add locale parameter to URL if missing
 * @param {string} pathname - The current pathname
 * @param {URLSearchParams} searchParams - The current search parameters
 * @param {string} detectedLocale - The detected locale (e.g., from browser)
 * @returns {string|null} The new URL with locale or null if no change needed
 */
export function addLocaleToUrl(pathname, searchParams, detectedLocale = null) {
  // If locale already exists in URL, no change needed
  if (searchParams.has('locale')) {
    return null;
  }
  
  // Create a new URLSearchParams instance
  const params = new URLSearchParams(searchParams);
  
  // Determine locale to use
  const localeToAdd = detectedLocale && locales.includes(detectedLocale) 
    ? detectedLocale 
    : defaultLocale;
  
  // Add locale parameter
  params.set('locale', localeToAdd);
  
  // Return new URL
  return `${pathname}?${params.toString()}`;
} 