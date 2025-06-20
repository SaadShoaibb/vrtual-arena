'use client'
import { useEffect, useState, useRef } from 'react'
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const LazyMedia = ({ type, src, index, poster }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '200px', // Load images 200px before they come into view
        threshold: 0.01 
      }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
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
            <>
              <div className={`absolute inset-0 bg-gray-800 animate-pulse ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                loading="lazy"
                width={640}
                height={360}
                quality={75}
                onError={handleImageError}
                onLoad={handleImageLoad}
                className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-2xl ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </>
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

const GalleryPage = () => {
  const [mediaItems, setMediaItems] = useState([])
  const [visibleItems, setVisibleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';

  // Demo images for development - optimized with smaller file sizes
  const demoImages = [
    '/gallery/gal1.png',
    '/gallery/gal2.png',
    '/gallery/gal3.png',
    '/gallery/gal4.png',
    '/gallery/gal5.png',
    '/gallery/gal6.png',
  ]

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
    }

    fetchMedia()
  }, [])

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Photo Booth Experience</h1>
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
              {visibleItems.map(({ type, src, index, poster }) => (
                <LazyMedia key={`${type}-${index}`} type={type} src={src} index={index} poster={poster} />
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