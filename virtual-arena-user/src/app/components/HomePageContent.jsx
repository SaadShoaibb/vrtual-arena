'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import About from "./About";
import Connected from "./Connected";
import Contact from "./Contact";
import Calender from "./Events";
import Experience from "./Experience";
import Footer from "./Footer";
import Gallery from "./Gallery";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import Offers from "./Offers";
import Package from "./Package";
import Plans from "./Plans";
import Testimonials from "./Testimonials";
import VRPackage from "./VrPackages";
import WhyChoose from "./WhyChoose";
import CountdownTimer from "./CountdownTimer";
import { addLocaleToUrl, validateLocale } from '../utils/languageUtils';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/Store/ReduxSlice/languageSlice';
import SEOHead from './SEOHead';
import LoadingPage from './LoadingPage';

export default function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState(() => validateLocale(searchParams.get('locale')));
  
  // Handle initial loading to prevent flicker
  useEffect(() => {
    // Ensure background is set immediately
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Minimal delay to ensure styles are applied
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const currentLocale = validateLocale(searchParams.get('locale'));
    
    // If no locale parameter is provided, add it based on browser language
    if (!searchParams.has('locale') && !isRedirecting) {
      setIsRedirecting(true);
      const browserLang = typeof navigator !== 'undefined' ? (navigator.language || navigator.userLanguage) : 'en';
      const detectedLocale = browserLang.startsWith('fr') ? 'fr' : 'en';
      
      // Redirect to add locale parameter
      const newUrl = addLocaleToUrl('/', searchParams, detectedLocale);
      if (newUrl) {
        router.replace(newUrl);
        return; // Exit early to prevent rendering before redirect
      }
    }
    
    // Update state and Redux only if locale changed
    if (currentLocale !== locale) {
      setLocale(currentLocale);
      dispatch(setLanguage(currentLocale));
    }
    
    setIsRedirecting(false);
  }, [router, searchParams, dispatch, locale, isRedirecting]);
  
  // Show loading during redirect or initial load
  if (isRedirecting || isLoading) {
    return <LoadingPage locale={locale} />;
  }

  return (
    <>
      <SEOHead page="home" locale={locale} />
      <div className="relative fade-in">
        <Navbar locale={locale} />
        <HeroSection locale={locale} />
        <CountdownTimer />
        <About locale={locale} />
        <Offers locale={locale} />
        <Experience locale={locale} />
        <Plans locale={locale} />
        <Package locale={locale} />
        <Calender locale={locale} />
        <Gallery locale={locale} />
        <VRPackage locale={locale} />
        <WhyChoose locale={locale} />
        <Testimonials locale={locale} />
        <Contact locale={locale} />
        <Connected locale={locale} />
        <Footer locale={locale} />
      </div>
    </>
  );
}