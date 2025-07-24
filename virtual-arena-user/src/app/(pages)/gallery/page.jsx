'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LazyMedia from '@/app/components/LazyMedia';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { translations } from '@/app/translations';



const GalleryPage = () => {
  const [mediaItems, setMediaItems] = useState([])
  const [visibleItems, setVisibleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;

  // Demo images for development - optimized with smaller file sizes
  const demoImages = [
    '/gallery/gal1.png',
    '/gallery/gal2.png',
    '/gallery/gal3.png',
    '/gallery/gal4.png',
    '/gallery/gal5.png',
    '/gallery/gal6.png',
  ]

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/gallery', {
        cache: 'force-cache', // Cache the response for better performance
        next: { revalidate: 3600 } // Revalidate every hour
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Process images with proper URLs
      const imageFiles = (data.images || []).map((item, index) => ({
        type: 'image',
        src: item.url || item,
        filename: item.filename || `image-${index}`,
        index
      }))

      // Process videos with proper URLs and posters
      const videoFiles = (data.videos || []).map((item, index) => ({
        type: 'video',
        src: item.url || item,
        poster: item.poster || item.url?.replace(/\.(mp4|webm|ogg)$/i, '.jpg'),
        filename: item.filename || `video-${index}`,
        index
      }))

      const allMedia = [...imageFiles, ...videoFiles]
      setMediaItems(allMedia)

      // Initially show only the first 6 items for faster page load
      setVisibleItems(allMedia.slice(0, 6))

      setError(null)
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
      setError(error.message)
      // Use demo images if API fails
      setVisibleItems(demoImages.map((src, index) => ({
        type: 'image',
        src,
        index
      })))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Load more items as user scrolls
  useEffect(() => {
    if (mediaItems.length <= 6) return;
    
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        const currentLength = visibleItems.length;
        const nextBatch = mediaItems.slice(currentLength, currentLength + 6);
        
        if (nextBatch.length > 0) {
          setVisibleItems(prev => [...prev, ...nextBatch]);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mediaItems, visibleItems]);

  return (
    <>
    <div className="bg-black text-white">
      <Navbar locale={locale} />
      
      {/* Hero Section - Optimized image loading */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        <Image 
          src="/assets/dealbg.png" 
          alt="Photo Booth Experience" 
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority={true}
          quality={85}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-wrap-balance">{t.photoBoothTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
              Capture fun memories with friends and family in our interactive VR photo booth.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-white">Our Gallery</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="w-full aspect-video animate-pulse bg-gray-700 rounded-2xl" />
              ))}
            </div>
          ) : error && visibleItems.length === 0 ? (
            <div className="text-center text-red-500 py-8">
              <p>We're experiencing issues loading our gallery.</p>
              <p className="text-sm mt-2">{error}</p>
              <h3 className="text-xl font-bold mt-8 mb-4 text-white">Preview Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {demoImages.map((src, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={src}
                      alt={`Gallery Preview ${index + 1}`}
                      width={640}
                      height={360}
                      quality={75}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-2xl"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div>
              <div className="text-center text-gray-400 py-8 mb-8">
                <p>Our gallery is currently being updated with fresh content.</p>
                <p>Check back soon for new images and videos!</p>
              </div>
              <h3 className="text-xl font-bold mt-8 mb-4 text-white">Preview Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {demoImages.map((src, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={src}
                      alt={`Gallery Preview ${index + 1}`}
                      width={640}
                      height={360}
                      quality={75}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-2xl"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {visibleItems.map(({ type, src, index, poster, filename }) => (
                <LazyMedia
                  key={`${type}-${index}-${filename}`}
                  type={type}
                  src={src}
                  index={index}
                  poster={poster}
                  alt={`Gallery ${type} ${index + 1}`}
                  className="aspect-video rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300"
                  priority={index < 3} // Prioritize first 3 items
                />
              ))}
            </div>
          )}
          
          {/* Loading indicator for infinite scroll */}
          {!loading && !error && mediaItems.length > visibleItems.length && (
            <div className="flex justify-center mt-8">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-[#DB1FEB] rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Photo Booth Experience Description */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-white">Photo Booth Experience</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Description and Features */}
            <div className="lg:col-span-2">
              <p className="text-lg text-gray-200 mb-8">
                Our interactive Photo Booth Experience combines the fun of traditional photo booths with cutting-edge 
                virtual reality technology. Choose from dozens of virtual backgrounds and fun digital props to create 
                memorable photos with friends and family. From fantastical landscapes to famous landmarks, the 
                possibilities are endless!
              </p>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-white">Experience Highlights</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200">
                  <li>Group photos for up to 6 people at once</li>
                  <li>Dozens of virtual backgrounds to choose from</li>
                  <li>Digital props and effects</li>
                  <li>Instant printing and digital sharing options</li>
                  <li>Perfect for parties, events, and special occasions</li>
                  <li>Suitable for all ages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">The Experience</h3>
                <p className="text-lg text-gray-200 mb-4">
                  Step into our state-of-the-art photo booth and choose from an extensive library of virtual backgrounds.
                  From exotic beaches to outer space, famous landmarks to fantasy worlds, we have something for everyone.
                </p>
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2D2D2D] p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white">Pricing</h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-[#DB1FEB] mb-2">Standard Session</h4>
                <p className="text-3xl font-bold mb-2">$25<span className="text-lg font-normal"> / session</span></p>
                <ul className="text-gray-200 space-y-2">
                  <li>• 15 minutes of booth time</li>
                  <li>• Up to 10 photos</li>
                  <li>• 2 printed copies</li>
                  <li>• Digital downloads</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-[#DB1FEB] mb-2">Premium Session</h4>
                <p className="text-3xl font-bold mb-2">$40<span className="text-lg font-normal"> / session</span></p>
                <ul className="text-gray-200 space-y-2">
                  <li>• 30 minutes of booth time</li>
                  <li>• Unlimited photos</li>
                  <li>• 5 printed copies</li>
                  <li>• Digital downloads</li>
                  <li>• Custom props</li>
                </ul>
              </div>
              
              <button className="w-full bg-gradient-to-r from-[#DB1FEB] to-[#7721F3] hover:from-[#7721F3] hover:to-[#DB1FEB] text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 mt-4">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
    </>
  )
}

export default GalleryPage 