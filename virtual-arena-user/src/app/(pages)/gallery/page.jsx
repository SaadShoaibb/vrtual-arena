'use client'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import SimpleImage from '@/app/components/SimpleImage';
import BookModal from '@/app/components/BookModal';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import { translations } from '@/app/translations';



// Demo images for development - optimized with smaller file sizes
const demoImages = [
  '/gallery/gal1.png',
  '/gallery/gal2.png',
  '/gallery/gal3.png',
  '/gallery/gal4.png',
  '/gallery/gal5.jpg',
  '/gallery/gal6.png',
]

const GalleryPage = () => {
  // Initialize with demo images immediately for instant page render
  const demoData = demoImages.map((src, index) => ({
    type: 'image',
    src,
    filename: `demo-${index}`,
    index
  }))

  const [mediaItems, setMediaItems] = useState(demoData)
  const [visibleItems, setVisibleItems] = useState(demoData.slice(0, 2))

  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  const dispatch = useDispatch();

  const handleBookNow = () => {
    dispatch(openBookModal({
      experienceType: 'Photo Booth',
      sessionName: 'Photo Booth Experience'
    }));
  };

  // Simplified media processing - only process what we need
  const processMediaData = useCallback((data) => {
    // Only process first 6 images for initial load (ignore videos for now)
    const imageFiles = (data.images || []).slice(0, 6).map((item, index) => ({
      type: 'image',
      src: item.url || item,
      filename: item.filename || `image-${index}`,
      index
    }))

    setMediaItems(imageFiles)
    // Show only first 2 items initially for ultra-fast loading
    setVisibleItems(imageFiles.slice(0, 2))
    setHasMore(imageFiles.length > 2)
  }, [])

  const fetchMedia = useCallback(async () => {
    // Demo images are already loaded, just try to fetch real data in background
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const res = await fetch('/api/gallery', {
        signal: controller.signal,
        cache: 'force-cache'
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (!data.error && data.images && data.images.length > 0) {
          // Update with real data if available
          processMediaData(data)
          console.log('Real gallery data loaded')
        }
      }
    } catch (error) {
      // Silently fail - demo images are already showing
      console.log('Gallery API unavailable, using demo images')
    }
  }, [])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Simple load more function
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Load 1 more item at a time for maximum performance
    const currentLength = visibleItems.length;
    if (currentLength < mediaItems.length) {
      const nextItem = mediaItems.slice(currentLength, currentLength + 1);
      setVisibleItems(prev => [...prev, ...nextItem]);
      setHasMore(currentLength + 1 < mediaItems.length);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [mediaItems, visibleItems, isLoadingMore, hasMore]);

  // Simplified scroll handler
  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.offsetHeight;

        if (scrollPosition >= documentHeight - 300 && hasMore && !isLoadingMore) {
          loadMore();
        }
      }, 300); // Longer delay for better performance
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loadMore, hasMore, isLoadingMore]);

  return (
    <>
    <div className="bg-black text-white">
      <Navbar locale={locale} />
      
      {/* Hero Section - Ultra-optimized loading */}
      <div className="relative h-[60vh] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 z-10"></div>
        <Image
          src="/assets/dealbg.png"
          alt="Photo Booth Experience"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority={true}
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {visibleItems.map(({ src, index, filename }) => (
              <SimpleImage
                key={`image-${index}-${filename || index}`}
                src={src}
                index={index}
                alt={`Gallery Image ${index + 1}`}
                className="aspect-video rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300"
                priority={index === 0} // Only prioritize the very first item
              />
            ))}
          </div>

          {/* Load More Button for better UX */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
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
              
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-[#DB1FEB] to-[#7721F3] hover:from-[#7721F3] hover:to-[#DB1FEB] text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 mt-4"
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />

      {/* Booking Modal */}
      <BookModal locale={locale} />
    </div>
    </>
  )
}

export default GalleryPage 