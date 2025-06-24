'use client';

import { Toaster } from "react-hot-toast";
import Providers from "./Provider";
import TranslationProvider from "./TranslationProvider";

export default function ClientLayout({ children }) {
  return (
    <Providers>
      <TranslationProvider>
        <Toaster position="top-right" />
        {children}
      </TranslationProvider>
    </Providers>
  );
}
