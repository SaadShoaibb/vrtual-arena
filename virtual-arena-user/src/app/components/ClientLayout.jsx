'use client';

import { Toaster } from "react-hot-toast";
import Providers from "./Provider";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import TranslationProvider from "./TranslationProvider";
import { locales, defaultLocale } from '../translations';

export default function ClientLayout({ children }) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get('locale') || defaultLocale;
  
  // Update HTML lang attribute dynamically
  useEffect(() => {
    if (document && document.documentElement) {
      // Use the locale if it's valid, otherwise fall back to default
      const validLocale = locales.includes(locale) ? locale : defaultLocale;
      document.documentElement.lang = validLocale;
      
      // Also update the dir attribute if needed (for RTL languages in the future)
      document.documentElement.dir = 'ltr';
    }
  }, [locale]);
  
  return (
    <Providers>
      <TranslationProvider>
        <Toaster position="top-right" />
        {children}
      </TranslationProvider>
    </Providers>
  );
} 