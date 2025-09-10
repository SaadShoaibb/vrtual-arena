'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { MdOutlineEventSeat } from 'react-icons/md';
import { IoMdTime, IoMdPeople } from 'react-icons/io';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import BookModal from '@/app/components/BookModal';
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import { useExperienceMedia } from '@/app/hooks/useExperienceMedia';
import { translations } from '@/app/translations';

export default function DynamicExperiencePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  const dispatch = useDispatch();
  const [experience, setExperience] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allExperiences, setAllExperiences] = useState([]);
  
  // Fetch media from database using the same hook as hardcoded pages
  const { showcaseImages, showcaseVideos, loading: mediaLoading } = useExperienceMedia(params.slug, []);

  useEffect(() => {
    fetchExperience();
    fetchAllExperiences();
  }, [params.slug]);

  useEffect(() => {
    // Show all media images in slideshow (header image is separate)
    if (showcaseImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showcaseImages.length]);

  const fetchExperience = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const url = `${API_URL}/user/experiences/${params.slug}`;
      console.log('Fetching experience from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Experience API response:', data);
      
      if (data.success) {
        setExperience(data.experience);
        console.log('Experience loaded:', data.experience);
      } else {
        console.error('API returned error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    dispatch(openBookModal({
      experienceType: experience.title,
      sessionName: `${experience.title} Experience`
    }));
  };

  const fetchAllExperiences = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${API_URL}/user/experiences`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out current experience and get 3 random others
        const others = data.experiences.filter(exp => exp.slug !== params.slug);
        const shuffled = others.sort(() => 0.5 - Math.random());
        setAllExperiences(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Experience not found</div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-black text-white">
      <Navbar locale={locale} />
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        {(experience.header_image_url || showcaseImages.length > 0) && (
          <img 
            src={experience.header_image_url ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace('/api/v1', '')}${experience.header_image_url}` : showcaseImages[0]} 
            alt={experience.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load header image:', e.target.src);
              // Fallback to first media image if header image fails
              if (showcaseImages.length > 0) {
                e.target.src = showcaseImages[0];
              }
            }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-wrap-balance">
              {locale === 'fr' && experience.title_fr ? experience.title_fr : experience.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-wrap-balance">
              {locale === 'fr' && experience.description_fr ? experience.description_fr : experience.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description and Features */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-white text-wrap-balance">{t.experienceOverview}</h2>
            <p className="text-lg text-gray-200 mb-8 text-wrap-balance">
              {locale === 'fr' && experience.description_fr ? experience.description_fr : experience.description}
            </p>

            {((locale === 'fr' && experience.features_fr && experience.features_fr.length > 0) || (experience.features && experience.features.length > 0)) && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-white text-wrap-balance">{t.experienceHighlights}</h3>
                <ul className="list-disc list-inside space-y-3 text-gray-200">
                  {(locale === 'fr' && experience.features_fr ? experience.features_fr : experience.features).map((feature, index) => (
                    <li key={index} className="text-wrap-balance">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Booking Info */}
          <div className="lg:col-span-1">
            {/* Image Showcase */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="relative aspect-auto overflow-hidden rounded-lg">
                {showcaseImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${experience.title} ${index + 1}`} 
                    className={`w-full h-auto object-contain transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    } ${index !== currentImageIndex ? 'absolute inset-0' : ''}`}
                    onError={(e) => {
                      console.error('Failed to load media image:', e.target.src);
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-white">{t.experienceDetails}</h3>
              
              <div className="space-y-6 mb-8">
                {experience.capacity && (
                  <div className="flex items-center">
                    <MdOutlineEventSeat className="text-[#DB1FEB] text-2xl mr-4" />
                    <div>
                      <p className="font-semibold text-white">{t.capacity}</p>
                      <p className="text-gray-300">{experience.capacity}</p>
                    </div>
                  </div>
                )}
                
                {experience.duration && (
                  <div className="flex items-center">
                    <IoMdTime className="text-[#DB1FEB] text-2xl mr-4" />
                    <div>
                      <p className="font-semibold text-white">{t.duration}</p>
                      <p className="text-gray-300">{experience.duration}</p>
                    </div>
                  </div>
                )}
                
                {experience.age_requirement && (
                  <div className="flex items-center">
                    <IoMdPeople className="text-[#DB1FEB] text-2xl mr-4" />
                    <div>
                      <p className="font-semibold text-white">{t.ageRequirement}</p>
                      <p className="text-gray-300">{experience.age_requirement}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {(experience.single_player_price || experience.pair_price) && (
                <>
                  <h4 className="text-xl font-bold mb-4 text-white">{t.pricing}</h4>
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    {experience.single_player_price && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{t.singleSession}</span>
                        <span className="font-bold text-white">${parseFloat(experience.single_player_price).toFixed(2)}</span>
                      </div>
                    )}
                    {experience.pair_price && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{t.twoSessions}</span>
                        <span className="font-bold text-white">${parseFloat(experience.pair_price).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{t.groupDiscount} (5+ people)</span>
                      <span className="font-bold text-white">10% off</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      <span className="text-[#DB1FEB] font-bold">{t.allInclusivePricing}</span> - {t.whatYouSeeIsWhatYouPay}.
                      No hidden fees or taxes added at checkout.
                    </p>
                  </div>
                </>
              )}
              
              <button
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white text-lg font-bold py-3 px-6 rounded-full mb-4"
              >
                {t.bookNow}
              </button>

              <a href="/pricing" className="block w-full">
                <button className="w-full border border-white text-white hover:bg-white hover:text-black transition-colors font-bold py-3 px-6 rounded-full">
                  {t.viewAvailablePackages}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Experiences Section */}
      {allExperiences.length > 0 && (
        <div className="bg-gray-900">
          <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 py-16">
            <h2 className="text-3xl font-bold mb-8 text-white">{t.youMightAlsoLike}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allExperiences.map((exp) => (
                <div key={exp.id} className="bg-black rounded-xl overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden bg-gray-800">
                    {exp.media && exp.media.length > 0 ? (
                      <img 
                        src={exp.media[0].media_url.startsWith('/uploads/') ? `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace('/api/v1', '')}${exp.media[0].media_url}` : exp.media[0].media_url} 
                        alt={exp.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center" style={{display: exp.media && exp.media.length > 0 ? 'none' : 'flex'}}>
                      <span className="text-gray-400">No Image</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{exp.title}</h3>
                    <p className="text-gray-300 mb-4">{exp.description.substring(0, 80)}...</p>
                    <a 
                      href={`/experiences/${exp.slug}`}
                      className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                    >
                      {t.learnMore} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer locale={locale} />

      {/* Booking Modal */}
      <BookModal locale={locale} />
    </div>
    </>
  );
}