import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './app/translations';

/**
 * Middleware to handle language detection and redirection
 * This runs on the edge before the page is rendered
 */
export function middleware(request) {
  // Get pathname
  const pathname = request.nextUrl.pathname;
  
  // Skip for API routes, static files, etc.
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }
  
  // Check if locale exists in URL
  const hasLocaleParam = request.nextUrl.searchParams.has('locale');
  
  // If no locale parameter, add it based on Accept-Language header
  if (!hasLocaleParam) {
    // Get browser language from header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0] || defaultLocale;
    
    // Determine locale to use
    const detectedLocale = locales.includes(browserLang) ? browserLang : defaultLocale;
    
    // Create new URL with locale parameter
    const newUrl = new URL(request.nextUrl.href);
    newUrl.searchParams.set('locale', detectedLocale);
    
    // Redirect to URL with locale parameter
    return NextResponse.redirect(newUrl);
  }
  
  // Continue with request if locale parameter exists
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Skip static files, API routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 