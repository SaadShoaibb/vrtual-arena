'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getLocalizedUrl, validateLocale } from '@/app/utils/languageUtils';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/Store/ReduxSlice/languageSlice';
import { locales } from '@/app/translations';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Determine current locale from query parameter
  const getLocale = () => {
    const locale = searchParams.get('locale');
    return validateLocale(locale);
  };
  
  const locale = getLocale();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (newLocale) => {
    // Update Redux state
    dispatch(setLanguage(newLocale));
    
    // Update URL and navigate
    const newUrl = getLocalizedUrl(pathname, searchParams, newLocale);
    router.push(newUrl);
    
    // Close dropdown
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center items-center text-white text-base md:text-lg font-semibold border-b-2 border-transparent hover:border-[#DB1FEB] whitespace-nowrap"
        onClick={toggleDropdown}
        aria-label={`Current language: ${locale === 'en' ? 'English' : 'French'}`}
      >
        {locale === 'en' ? 'EN' : 'FR'}
        <svg className="ml-1 h-3 w-3 md:h-4 md:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-black bg-opacity-90 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {locales.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`block w-full text-left px-4 py-2 text-sm ${locale === lang ? 'text-[#DB1FEB]' : 'text-white'} hover:text-[#DB1FEB] transition-colors`}
                role="menuitem"
              >
                {lang === 'en' ? 'English' : 'Français'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 