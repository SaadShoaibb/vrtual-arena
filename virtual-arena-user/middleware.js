import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Get the preferred locale from request headers
function getLocale(request) {
  // Check for cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // Check for accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => {
        const shortLang = lang.substring(0, 2);
        return locales.includes(shortLang);
      });
    
    if (preferredLocale) {
      return preferredLocale.substring(0, 2);
    }
  }
  
  // Default locale as fallback
  return defaultLocale;
}

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip middleware for static files, api routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Check if the request already has a locale parameter
  const hasLocaleParam = searchParams.has('locale');
  
  if (hasLocaleParam) {
    return NextResponse.next();
  }
  
  // Get the preferred locale
  const locale = getLocale(request);
  
  // Add locale as a query parameter
  const newUrl = new URL(request.url);
  newUrl.searchParams.set('locale', locale);
  
  // Set cookie for future requests
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', locale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|static|.*\\..*).*)'],
}; 