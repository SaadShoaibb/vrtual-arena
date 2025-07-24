'use client'

import React, { useState, useEffect, useRef } from 'react'
import BookNowButton from '../common/BookNowButton'
import { useTranslation } from '@/app/hooks/useTranslation'
import { translations } from '@/app/translations'
import { FaPause, FaPlay } from 'react-icons/fa'
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

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Open booking modal using Redux
  const handleOpenBookModal = () => {
    dispatch(openBookModal());
  };

  // Description text with proper translation
  const descriptionText = locale === 'fr' 
    ? "Vous rapprocher de la réalité grâce à des expériences VR inoubliables."
    : "Bringing you closer to reality through unforgettable VR experiences.";

  return (
    <div className="relative h-[70vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
      {/* Background video/image slider */}
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
              <span className="block">Explore the</span>
              <span className="block">Future</span>
              <span className="block">With <img src="/assets/logo.png" alt="VRtual Arena" className="h-12 sm:h-14 md:h-16 inline-block" /></span>
            </motion.h1>
            <motion.p
              key={`desc-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto text-wrap-balance text-shadow"
            >
              {descriptionText}
            </motion.p>
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
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="text-white hover:text-[#DB1FEB] transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
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


      {/* Add text shadow style */}
      <style jsx global>{`
        .text-shadow {
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  )
}

export default HeroSection
