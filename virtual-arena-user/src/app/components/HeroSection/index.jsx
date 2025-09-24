'use client'

import React, { useState, useEffect, useRef } from 'react'
import BookNowButton from '../common/BookNowButton'
import { useTranslation } from '@/app/hooks/useTranslation'
import { translations } from '@/app/translations'

import Link from 'next/link'
import AuthModel from '../AuthModal'
import BookingForm from '../BookingForm'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'

const HeroSection = ({ locale = 'en' }) => {
  const t = locale === 'fr' ? translations.fr : translations.en;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideInterval = useRef(null);
  const dispatch = useDispatch();

  // Slides data with different content for each language
  const slides = [
    {
      title: t.heroTitle1,
      description: t.heroDesc1,
      image: "/assets/herobg.jpg",
      altText: "Virtual Reality Gaming"
    },
    {
      title: t.heroTitle2,
      description: t.heroDesc2,
      image: "/assets/pricingbg.png",
      altText: "Racing Simulators"
    }
  ];

  // Start the slideshow
  useEffect(() => {
    if (isPlaying) {
      slideInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
    }
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPlaying, slides.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset the interval when manually navigating
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    setIsPlaying(true);
  };



  // Open booking modal using Redux
  const handleOpenBookModal = () => {
    dispatch(openBookModal());
  };



  return (
    <div className="relative h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <img
              src={slide.image}
              alt={slide.altText}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative h-full z-10 flex flex-col justify-center items-center text-white px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-wrap-balance text-shadow"
            >
              <span className="block">{t.stepIntoThe}</span>
              <span className="block">{t.newReality}</span>
            </motion.h1>
            <motion.div
              key={`logo-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
       <div className="relative flex items-center justify-center">
  {/* Circular orbit sparkles */}
  <div className="sparkle-path"></div>

  {/* Floating sparkles */}
  <div className="floating-sparkle"></div>
  <div className="floating-sparkle"></div>
  <div className="floating-sparkle"></div>
  <div className="floating-sparkle"></div>

  {/* Animated logo */}
  <motion.img
    src="/assets/logo.png"
    alt="VRtual Arena"
    className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto relative z-10"
    animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
  />
</div>

            </motion.div>
            <motion.div
              key={`buttons-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-10 items-center"
            >
              <button
                onClick={handleOpenBookModal}
                className="bg-gradient-to-r from-[#DB1FEB] to-[#7721F3] hover:from-[#7721F3] hover:to-[#DB1FEB] text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-48"
              >
                {t.bookNow} 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2"/>
                  <path d="M10 7L16 12L10 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Link href={`/gallery?locale=${locale}`} className="w-48">
                <button className="bg-transparent border border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full">
                  {t.exploreExperiences}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 7L16 12L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-[#DB1FEB]"
                  : "w-2 bg-white opacity-50 hover:opacity-100"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Booking Modal */}


      {/* Add text shadow style and custom animations */}
   <style jsx global>{`
  .text-shadow {
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* Circular orbit sparkles */
  .sparkle-path {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.9) 2px, transparent 2px),
      radial-gradient(circle at 70% 40%, rgba(0, 191, 255, 0.8) 2px, transparent 2px),
      radial-gradient(circle at 40% 70%, rgba(255, 223, 100, 0.8) 1.5px, transparent 1.5px),
      radial-gradient(circle at 80% 20%, rgba(135, 206, 250, 0.7) 1.5px, transparent 1.5px),
      radial-gradient(circle at 50% 10%, rgba(255, 255, 200, 0.9) 1px, transparent 1px),
      radial-gradient(circle at 10% 50%, rgba(255, 223, 150, 0.6) 1px, transparent 1px),
      radial-gradient(circle at 90% 60%, rgba(173, 216, 230, 0.7) 1.5px, transparent 1.5px),
      radial-gradient(circle at 30% 80%, rgba(255, 215, 0, 0.7) 1.5px, transparent 1.5px),
      radial-gradient(circle at 60% 90%, rgba(0, 191, 255, 0.6) 1.5px, transparent 1.5px),
      radial-gradient(circle at 75% 75%, rgba(255, 230, 180, 0.7) 1px, transparent 1px),
      radial-gradient(circle at 25% 60%, rgba(100, 200, 255, 0.7) 1px, transparent 1px),
      radial-gradient(circle at 85% 35%, rgba(255, 200, 100, 0.8) 1px, transparent 1px);
    animation: spin 10s linear infinite;
    z-index: 5;
    filter: blur(0.5px);
    pointer-events: none;
  }

  /* Floating upward sparkles */
  .floating-sparkle {
    position: absolute;
    bottom: 0;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 215, 0, 0.9);
    animation: floatUp 6s linear infinite;
    opacity: 0.8;
    filter: blur(0.5px);
  }

  .floating-sparkle:nth-child(2) {
    left: 30%;
    background: rgba(0, 191, 255, 0.9);
    animation-duration: 7s;
    animation-delay: 2s;
  }
  .floating-sparkle:nth-child(3) {
    left: 60%;
    background: rgba(255, 223, 100, 0.9);
    animation-duration: 5s;
    animation-delay: 1s;
  }
  .floating-sparkle:nth-child(4) {
    left: 80%;
    background: rgba(173, 216, 230, 0.9);
    animation-duration: 8s;
    animation-delay: 3s;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
  }
`}</style>


    </div>
  )
}

export default HeroSection


