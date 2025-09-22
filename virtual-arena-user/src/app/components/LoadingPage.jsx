'use client';
import { useEffect, useState } from 'react';

export default function LoadingPage({ locale = 'en' }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Ensure background stays black during loading
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
  }, []);
  
  const loadingText = locale === 'fr' ? 'Chargement de Virtual Arena...' : 'Loading Virtual Arena...';
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: '#000000',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <div className="text-white text-lg font-medium">
          {loadingText}
        </div>
        
        {/* Add skeleton content to prevent layout shifts */}
        <div className="mt-8 space-y-3 w-64 mx-auto opacity-30">
          <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}