'use client';

import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Providers from './Provider';
import TranslationProvider from './TranslationProvider';
import LocaleUpdater from './LocaleUpdater';

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <TranslationProvider>
        <Suspense fallback={null}>
          <LocaleUpdater />
        </Suspense>
        <Toaster position="top-right" />
        {children}
      </TranslationProvider>
    </Providers>
  );
}
