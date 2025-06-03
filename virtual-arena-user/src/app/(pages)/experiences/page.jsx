'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const LazyMedia = ({ type, src, index, poster }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  }

  return (
    <div
      ref={ref}
      className="relative aspect-video overflow-hidden rounded-2xl shadow-lg bg-gray-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300"
    >
      {isVisible ? (
        type === 'image' ? (
          error ? (
            <div className="w-full h-full flex items-center justify-center text-white">
              Failed to load image
            </div>
          ) : (
            <Image
              src={src}
              alt={`Gallery Image ${index + 1}`}
              loading="lazy"
              width={1280}
              height={720}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-2xl"
            />
          )
        ) : (
          <div className="relative w-full h-full">
            <video
              controls
              playsInline
              preload="metadata"
              poster={poster || '/gallery/video-thumb.jpg'}
              className="w-full h-full object-cover rounded-2xl outline-none transition-all duration-300 hover:brightness-110"
              onError={handleImageError}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      ) : (
        <div className="w-full h-full animate-pulse bg-gray-700 rounded-2xl" />
      )}
    </div>
  )
}

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/gallery')
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()

        if (data.error) {
          throw new Error(data.error)
        }

        const imageFiles = (data.images || []).map((file, index) => ({
          type: 'image',
          src: file,
          index
        }))

        const videoFiles = (data.videos || []).map((file, index) => ({
          type: 'video',
          src: file,
          poster: file.replace(/\.mp4$/, '.webp'),
          index
        }))

        setMediaItems([...imageFiles, ...videoFiles])
        setError(null)
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  if (error) {
    console.error('Gallery error:', error);
  }

  return (
    <div className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen">
      <Navbar />

      <section className="px-4 py-12 sm:px-6 lg:px-24 2xl:px-48">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 tracking-tight animate-pulse text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
          Experiences Gallery
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="w-full aspect-video animate-pulse bg-gray-700 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No media items found in the gallery
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map(({ type, src, index, poster }) => (
              <LazyMedia key={`${type}-${index}`} type={type} src={src} index={index} poster={poster} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
