'use client';

import { useEffect } from 'react';

export default function HydrationHandler() {
  useEffect(() => {
    // Remove loading class once React has hydrated
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Set a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      document.body.style.visibility = 'visible';
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}