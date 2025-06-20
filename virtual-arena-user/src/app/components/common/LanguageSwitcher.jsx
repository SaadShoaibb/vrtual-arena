'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getLocalizedUrl } from '@/app/utils/languageUtils';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/Store/ReduxSlice/languageSlice';
import { locales, translations } from '@/app/translations';

/**
 * A component that renders language switching buttons
 * @param {Object} props - Component props
 * @param {string} props.currentLocale - The current locale
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showLabel - Whether to show language labels
 * @param {string} props.buttonStyle - Style variant for buttons ('default', 'pill', 'text', 'compact')
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
export default function LanguageSwitcher({ 
  currentLocale, 
  className = '', 
  showLabel = true, 
  buttonStyle = 'default',
  size = 'md'
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const t = translations[currentLocale] || translations.en;

  const switchLanguage = (newLocale) => {
    // Update Redux state
    dispatch(setLanguage(newLocale));
    
    // Update URL and navigate
    const newUrl = getLocalizedUrl(pathname, searchParams, newLocale);
    router.push(newUrl);
  };

  // Define size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default: // md
        return 'text-sm';
    }
  };

  // Define button style classes based on variant
  const getButtonClasses = (locale) => {
    const isActive = locale === currentLocale;
    const sizeClass = getSizeClasses();
    
    switch (buttonStyle) {
      case 'pill':
        return `px-2 sm:px-3 py-1 rounded-full ${sizeClass} ${
          isActive 
            ? 'bg-[#DB1FEB] text-white' 
            : 'bg-transparent text-gray-300 hover:text-white'
        }`;
      
      case 'text':
        return `px-1 sm:px-2 ${sizeClass} ${
          isActive 
            ? 'text-[#DB1FEB] font-bold' 
            : 'text-gray-300 hover:text-white'
        }`;
        
      case 'compact':
        return `px-1 ${sizeClass} ${
          isActive 
            ? 'text-[#DB1FEB] font-bold' 
            : 'text-gray-300 hover:text-white'
        }`;
        
      default: // default style
        return `px-1 sm:px-2 py-1 ${sizeClass} border-b-2 ${
          isActive 
            ? 'border-[#DB1FEB] text-white font-semibold' 
            : 'border-transparent text-gray-300 hover:text-white'
        }`;
    }
  };

  // Get language name based on locale
  const getLanguageName = (locale) => {
    return locale === 'en' ? t.english : t.french;
  };

  // Get aria label for language switch button
  const getAriaLabel = (locale) => {
    return locale === 'en' ? t.switchToEnglish : t.switchToFrench;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          className={`transition-colors ${getButtonClasses(locale)}`}
          aria-label={getAriaLabel(locale)}
        >
          {showLabel 
            ? getLanguageName(locale) 
            : locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
} 