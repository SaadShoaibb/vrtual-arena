'use client'
import { useState } from 'react'
import Image from 'next/image'

const SimpleImage = ({ src, alt, index, priority = false, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  if (error) {
    return (
      <div className={`relative bg-gray-800 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Image unavailable</div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt || `Gallery Image ${index + 1}`}
        fill
        priority={priority}
        quality={priority ? 60 : 40}
        onError={handleError}
        onLoad={handleLoad}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

export default SimpleImage
