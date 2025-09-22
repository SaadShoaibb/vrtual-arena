'use client';

import { useEffect } from 'react';

export default function HydrationHandler() {
  useEffect(() => {
    // Simple hydration complete handler
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, []);
  
  return null;
}