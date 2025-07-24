'use client'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'

const LazyMedia = ({ 
  type, 
  src, 
  poster, 
  alt, 
  index, 
  className = "",
  priority = false,
  onLoad = () => {},
  onError = () => {}
}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  // Memoize intersection observer options - more aggressive for performance
  const observerOptions = useMemo(() => ({
    rootMargin: '100px', // Reduced for better performance
    threshold: 0.01 // Lower threshold for earlier loading
  }), [])

  // Memoize intersection observer callback
  const handleIntersection = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [handleIntersection, observerOptions])

  // Memoize error handler
  const handleError = useCallback(() => {
    console.error(`Failed to load ${type}: ${src}`)

    if (retryCount < maxRetries) {
      // Retry loading after a delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setError(false)
        setIsLoaded(false)
      }, 1000 * (retryCount + 1)) // Exponential backoff
    } else {
      setError(true)
      onError()
    }
  }, [type, src, retryCount, maxRetries, onError])

  // Memoize load handlers
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad()
  }, [onLoad])

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad()
  }, [onLoad])

  // Memoize components to prevent unnecessary re-renders
  const ErrorFallback = useMemo(() => ({ message }) => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white rounded-xl">
      <div className="text-center p-4">
        <p className="text-sm font-medium mb-2">Unable to load {type}</p>
        <p className="text-xs text-gray-400">{message}</p>
        {retryCount < maxRetries && (
          <p className="text-xs text-blue-400 mt-2">Retrying...</p>
        )}
      </div>
    </div>
  ), [type, retryCount, maxRetries])

  const LoadingPlaceholder = useMemo(() => () => (
    <div className="w-full h-full bg-gray-700 animate-pulse rounded-xl flex items-center justify-center">
      <div className="text-gray-400 text-sm">
        Loading {type}...
      </div>
    </div>
  ), [type])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gray-900 ${className}`}
    >
      {!isVisible ? (
        <LoadingPlaceholder />
      ) : error ? (
        <ErrorFallback message="Content temporarily unavailable" />
      ) : type === 'image' ? (
        <div className="relative w-full h-full">
          {!isLoaded && <LoadingPlaceholder />}
          <Image
            src={src}
            alt={alt || `Gallery Image ${index + 1}`}
            fill
            priority={priority}
            quality={priority ? 70 : 50} // Reduced quality for better performance
            onError={handleError}
            onLoad={handleLoad}
            className={`object-cover transition-all duration-300 hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      ) : (
        <div className="relative w-full h-full">
          {!isLoaded && <LoadingPlaceholder />}
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster}
            className={`w-full h-full object-cover transition-all duration-300 hover:brightness-110 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleError}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
          >
            <source src={src} type="video/mp4" />
            <source src={src.replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}

export default LazyMedia
