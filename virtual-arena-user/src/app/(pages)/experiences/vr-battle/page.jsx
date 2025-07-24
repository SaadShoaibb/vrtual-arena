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

const VRBattlePage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  const dispatch = useDispatch();

  const handleBookNow = () => {
    dispatch(openBookModal({
      experienceType: 'VR Battle',
      sessionName: 'VR Battle Arena'
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
          src="/assets/dealbg.png" 
          alt="VR Battle Experience" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white text-wrap-balance">{t.vrBattleTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl text-wrap-balance">
              {t.vrBattleDescription}
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
              {t.vrBattleOverviewText}
            </p>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-white">{t.experienceHighlights}</h3>
              <ul className="list-disc list-inside space-y-3 text-gray-200">
                {t.vrBattleHighlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">{t.theExperience}</h3>
              <p className="text-lg text-gray-200 mb-4">
                {t.vrBattleExperienceText}
              </p>
              <p className="text-lg text-gray-200 mb-8">
                You can choose from a variety of games - from intense first-person shooters where you take cover 
                and return fire, to cooperative puzzle games requiring perfect communication, to virtual sports 
                where you can serve, spike, and swing against each other. The VR Battle stations provide enough 
                space for dynamic movement while ensuring you stay safely within your play area. Voice communication 
                lets you strategize or trash-talk in real-time, adding another dimension to the competitive experience.
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
                    <p className="text-gray-300">30-45 minutes per session</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IoMdPeople className="text-[#DB1FEB] text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Age Requirement</p>
                    <p className="text-gray-300">12 years and older</p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold mb-4 text-white">Pricing</h4>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Per Player</span>
                  <span className="font-bold text-white">$9.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Pair (2 players)</span>
                  <span className="font-bold text-white">$15.00</span>
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
            {/* VR WARRIOR Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">VR WARRIOR</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">VR WARRIOR (Kids)</h3>
                <p className="text-gray-300 mb-4">A child-friendly battle experience designed specifically for younger players.</p>
                <a 
                  href="/experiences/vr-warrior"
                  className="inline-block text-[#DB1FEB] font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </div>
            
            {/* VR 360 Card */}
            <div className="bg-black rounded-xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white">VR 360</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">VR 360</h3>
                <p className="text-gray-300 mb-4">Experience full 360° immersion with our rotating VR chairs.</p>
                <a 
                  href="/experiences/vr-360"
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

export default VRBattlePage;
