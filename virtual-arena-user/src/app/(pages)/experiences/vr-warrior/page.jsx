'use client';
import React from 'react';
import { IoMdPeople, IoMdTime } from 'react-icons/io';
import { MdOutlineEventSeat } from 'react-icons/md';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import BookModal from '@/app/components/BookModal';
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import { translations } from '@/app/translations';

const VRWarriorPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  const dispatch = useDispatch();

  const handleBookNow = () => {
    dispatch(openBookModal({
      experienceType: 'VR Warrior',
      sessionName: 'VR Warrior Kids Experience'
    }));
  };
  return (
    <>
    <div className="bg-black text-white">
      <Navbar locale={locale} />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        <img 
          src="/assets/deal1.png" 
          alt="VR WARRIOR Experience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-wrap-balance">{t.vrWarriorTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-wrap-balance">
              {t.vrWarriorDescription}
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
              {t.vrWarriorOverviewText}
            </p>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-white">{t.experienceHighlights}</h3>
              <ul className="list-disc list-inside space-y-3 text-gray-200">
                {t.vrWarriorHighlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">{t.theExperience}</h3>
              <p className="text-lg text-gray-200 mb-4">
                {t.vrWarriorExperienceText}
              </p>
              <p className="text-lg text-gray-200 mb-8">
                Children can choose from a variety of fun games - from gentle tag games with colorful characters, 
                to magical treasure hunts, to superhero adventures where they can save the day. All games are 
                designed to be intuitive, engaging, and completely age-appropriate. Parents can watch their 
                child's adventure on our viewing screens, sharing in the excitement as they experience VR 
                for the first time. The VR WARRIOR experience is the perfect introduction to virtual reality 
                for children, creating magical memories while developing coordination and problem-solving skills.
              </p>
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
                    <p className="text-gray-300">2 players</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IoMdTime className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Duration</p>
                    <p className="text-gray-300">15-20 minutes per session</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IoMdPeople className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Age Requirement</p>
                    <p className="text-gray-300">6-12 years</p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold mb-4 text-white">Pricing</h4>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Per Child</span>
                  <span className="font-bold text-white">$7.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Pair (2 children)</span>
                  <span className="font-bold text-white">$12.00</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  <span className="text-[#DB1FEB] font-bold">All-Inclusive Pricing</span> - What you see is what you pay.
                  No hidden fees or taxes added at checkout.
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
                <p className="text-gray-300 mb-4">Another kid-friendly VR experience with creative and educational content.</p>
                <a 
                  href="/experiences/vr-cat"
                  className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
            
            {/* Photo Booth Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">Photo Booth</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Photo Booth</h3>
                <p className="text-gray-300 mb-4">Capture amazing photos in virtual worlds with our high-tech photo booth.</p>
                <a 
                  href="/experiences/photo-booth"
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
                <p className="text-gray-300 mb-4">A family-friendly experience for up to 5 people in our UFO simulator.</p>
                <a 
                  href="/experiences/ufo-spaceship"
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

export default VRWarriorPage;
