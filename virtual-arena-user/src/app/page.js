'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import About from "./components/About";
import Connected from "./components/Connected";
import Contact from "./components/Contact";
import Calender from "./components/Events";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Package from "./components/Package";
import Plans from "./components/Plans";
import Testimonials from "./components/Testimonials";
import VRPackage from "./components/VrPackages";
import WhyChoose from "./components/WhyChoose";
import { addLocaleToUrl, validateLocale } from './utils/languageUtils';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/Store/ReduxSlice/languageSlice';
import SEOHead from './components/SEOHead';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const locale = validateLocale(searchParams.get('locale'));
  
  useEffect(() => {
    // If no locale parameter is provided, add it based on browser language
    if (!searchParams.has('locale')) {
      const browserLang = navigator.language || navigator.userLanguage;
      const detectedLocale = browserLang.startsWith('fr') ? 'fr' : 'en';
      
      // Redirect to add locale parameter
      const newUrl = addLocaleToUrl('/', searchParams, detectedLocale);
      if (newUrl) {
        router.replace(newUrl);
      }
    }
    
    // Update Redux state with the current locale
    dispatch(setLanguage(locale));
  }, [router, searchParams, dispatch, locale]);

  return (
    <>
      <SEOHead page="home" locale={locale} />
      <div className="relative">
        <Navbar locale={locale} />
        <HeroSection locale={locale} />
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
