'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { initializeLanguage, setLanguage } from '@/Store/ReduxSlice/languageSlice';
import { locales, defaultLocale } from '@/app/translations';

/**
 * Provider component that initializes language settings and syncs URL locale with Redux state
 * This component should be included in the app layout
 */
const TranslationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const urlLocale = searchParams?.get('locale');
  
  // Initialize language from browser settings or cookies on client-side
  useEffect(() => {
    dispatch(initializeLanguage());
    
    // If URL has a locale parameter, update Redux state
    if (urlLocale && locales.includes(urlLocale)) {
      dispatch(setLanguage(urlLocale));
    }
  }, [dispatch, urlLocale]);
  
  return children;
};

export default TranslationProvider; 