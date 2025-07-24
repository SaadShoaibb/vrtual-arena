'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { IoMdPeople, IoMdTime } from 'react-icons/io';
import { MdOutlineEventSeat } from 'react-icons/md';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LazyMedia from '@/app/components/LazyMedia';
import BookModal from '@/app/components/BookModal';
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import { translations } from '@/app/translations';



const PhotoBoothPage = () => {
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

        const imageFiles = (data.images || []).map((item, index) => ({
          type: 'image',
          src: typeof item === 'string' ? item : item.url || item,
          filename: typeof item === 'object' ? item.filename : `image-${index}`,
          index
        }))

        const videoFiles = (data.videos || []).map((item, index) => {
          const src = typeof item === 'string' ? item : item.url || item;
          const filename = typeof item === 'object' ? item.filename : `video-${index}`;
          const poster = typeof item === 'object' && item.poster
            ? item.poster
            : (typeof src === 'string' ? src.replace(/\.(mp4|webm|ogg)$/i, '.jpg') : null);

          return {
            type: 'video',
            src,
            poster,
            filename,
            index
          };
        })

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

  return (
    <>
    <div className="bg-black text-white">
      <Navbar locale={locale} />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        <img 
          src="/assets/dealbg.png" 
          alt="Photo Booth Experience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-wrap-balance">{t.photoBoothTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-wrap-balance">
              {t.photoBoothDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description and Features */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-white">{t.experienceOverview}</h2>
            <p className="text-lg text-gray-200 mb-8">
              {t.photoBoothOverviewText}
            </p>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-white">{t.experienceHighlights}</h3>
              <ul className="list-disc list-inside space-y-3 text-gray-200">
                {t.photoBoothHighlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-white">{t.theExperience}</h3>
              <p className="text-lg text-gray-200 mb-4">
                {t.photoBoothExperienceText}
              </p>
              <p className="text-lg text-gray-200 mb-8">
                Our system uses green screen technology combined with high-resolution cameras to create
                stunning images that you can take home instantly or share directly to your social media accounts.
                It's the perfect addition to any party or special event!
              </p>
            </div>

            {/* Gallery Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Photo Gallery</h3>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((n) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {mediaItems.map(({ type, src, index, poster, filename }) => (
                    <LazyMedia
                      key={`${type}-${index}-${filename || src}`}
                      type={type}
                      src={src}
                      index={index}
                      poster={poster}
                      alt={`Photo Booth ${type} ${index + 1}`}
                      className="aspect-video rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300"
                      priority={index < 2} // Prioritize first 2 items
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-white">Experience Details</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <MdOutlineEventSeat className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Capacity</p>
                    <p className="text-gray-300">Up to 6 people</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IoMdTime className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Duration</p>
                    <p className="text-gray-300">15-30 minutes per session</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IoMdPeople className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Age Requirement</p>
                    <p className="text-gray-300">All ages welcome</p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold mb-4 text-white">Pricing</h4>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Basic Session (5 photos)</span>
                  <span className="font-bold text-white">$19.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Premium (10 photos)</span>
                  <span className="font-bold text-white">$29.99</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Digital Only</span>
                  <span className="font-bold text-white">$14.99</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  * Special event pricing available
                </p>
              </div>
              
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white text-lg font-bold py-3 px-6 rounded-full mb-4"
              >
                {t.bookNow}
              </button>

              <button className="w-full border border-white text-white hover:bg-white hover:text-black transition-colors font-bold py-3 px-6 rounded-full">
                {t.viewAvailablePackages}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Experiences Section */}
      <div className="bg-gray-900">
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-white">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* VR CAT Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">VR CAT</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">VR CAT (Kids)</h3>
                <p className="text-gray-300 mb-4">Educational VR experience designed for younger visitors.</p>
                <a 
                  href="/experiences/vr-cat"
                  className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
            
            {/* UFO Spaceship Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">UFO Spaceship</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">UFO Spaceship</h3>
                <p className="text-gray-300 mb-4">Pilot a UFO through immersive virtual worlds with our 5-seat simulator.</p>
                <a 
                  href="/experiences/ufo-spaceship"
                  className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
            
            {/* Free-roaming Arena Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">Free-roaming Arena</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Free-roaming Arena</h3>
                <p className="text-gray-300 mb-4">Explore our 34x49 feet arena with up to 10 players simultaneously.</p>
                <a 
                  href="/experiences/free-roaming-arena"
                  className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />

      {/* Booking Modal */}
      <BookModal locale={locale} />
    </div>
    </>
  );
};

export default PhotoBoothPage; 