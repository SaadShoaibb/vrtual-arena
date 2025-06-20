'use client'
import { useEffect, useState, useRef } from 'react'
import { IoMdPeople, IoMdTime } from 'react-icons/io';
import { MdOutlineEventSeat } from 'react-icons/md';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

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
            <img
              src={src}
              alt={`Gallery Image ${index + 1}`}
              loading="lazy"
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

const PhotoBoothPage = () => {
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

  return (
    <>
    <div className="bg-black text-white">
      <Navbar />
      
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Photo Booth Experience</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
              Capture fun memories with friends and family in our interactive VR photo booth.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description and Features */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-white">Experience Overview</h2>
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

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-white">The Experience</h3>
              <p className="text-lg text-gray-200 mb-4">
                Step into our state-of-the-art photo booth and choose from an extensive library of virtual backgrounds.
                From exotic beaches to outer space, famous landmarks to fantasy worlds, we have something for everyone.
                Add digital props, filters, and effects to make your photos truly unique.
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
                  {mediaItems.map(({ type, src, index, poster }) => (
                    <LazyMedia key={`${type}-${index}`} type={type} src={src} index={index} poster={poster} />
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
              
              <button className="w-full bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white text-lg font-bold py-3 px-6 rounded-full mb-4">
                Book Now
              </button>
              
              <button className="w-full border border-white text-white hover:bg-white hover:text-black transition-colors font-bold py-3 px-6 rounded-full">
                View Available Packages
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

      <Footer />
    </div>
    </>
  );
};

export default PhotoBoothPage; 