'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { translations } from '@/app/translations';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/Store/ReduxSlice/ModalSlice';
import { fetchUserData } from '@/Store/Actions/userActions';
import PaymentModal from '@/app/components/PaymentForm';

const PricingCalculator = ({ locale = 'en' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector(state => state.userData);
  const router = useRouter();
  const t = translations[locale] || translations.en;
  
  // Pricing data
  const experiences = [
    { id: 'free-roaming', name: t.freeRoamingArena, price1: 12, price2: 20 },
    { id: 'ufo-spaceship', name: t.ufoSpaceshipCinema, price1: 9, price2: 15 },
    { id: 'vr-360', name: t.vr360, price1: 9, price2: 15 },
    { id: 'vr-battle', name: t.vrBattle, price1: 9, price2: 15 },
    { id: 'vr-warrior', name: t.vrWarrior, price1: 7, price2: 12 },
    { id: 'vr-cat', name: t.vrCat, price1: 6, price2: 10 },
    { id: 'photo-booth', name: t.photoBooth, price1: 6, price2: 6, isPhoto: true }
  ];
  
  const hourlyPasses = [
    { id: '1hour', name: t.oneHourPass, price: 35, description: t.unlimitedAccess },
    { id: '2hour', name: t.twoHourPass, price: 55, description: t.unlimitedAccess },
    { id: 'halfday', name: t.halfDayPass, price: 85, description: t.fourHoursAccess },
    { id: 'fullday', name: t.fullDayPass, price: 120, description: t.allDayAccess },
    { id: 'weekend', name: t.weekendPass, price: 199, description: t.weekendAccess }
  ];
  
  const groupDiscounts = [
    { id: 'small', name: '5-9 people', discount: 10 },
    { id: 'medium', name: '10-19 people', discount: 15 },
    { id: 'large', name: '20+ people', discount: 20 }
  ];
  
  // State
  const [selectedTab, setSelectedTab] = useState('experiences');
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Handle experience selection
  const handleExperienceSelect = (experienceId) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    
    // Check if already selected
    const existingIndex = selectedExperiences.findIndex(
      item => item.experienceId === experienceId
    );
    
    if (existingIndex >= 0) {
      // Already selected, remove it
      const updatedExperiences = [...selectedExperiences];
      updatedExperiences.splice(existingIndex, 1);
      setSelectedExperiences(updatedExperiences);
    } else {
      // Add new experience with 1 session by default
      setSelectedExperiences([
        ...selectedExperiences,
        {
          experienceId,
          name: experience.name,
          sessions: 1,
          price: experience.price1,
          isPhoto: experience.isPhoto || false
        }
      ]);
    }
  };
  
  // Handle session count change
  const handleSessionChange = (experienceId, sessions) => {
    const updatedExperiences = selectedExperiences.map(item => {
      if (item.experienceId === experienceId) {
        const experience = experiences.find(exp => exp.id === experienceId);
        const price = sessions === 1 ? experience.price1 : experience.price2;
        return { ...item, sessions, price };
      }
      return item;
    });
    
    setSelectedExperiences(updatedExperiences);
  };
  
  // Handle pass selection
  const handlePassSelect = (passId) => {
    if (selectedPass === passId) {
      setSelectedPass(null);
    } else {
      setSelectedPass(passId);
      setSelectedExperiences([]);
    }
  };
  
  // Handle people count change
  const handlePeopleCountChange = (count) => {
    setPeopleCount(Math.max(1, count));
  };
  
  // Calculate total price
  useEffect(() => {
    let price = 0;
    
    if (selectedPass) {
      const pass = hourlyPasses.find(p => p.id === selectedPass);
      price = pass.price * peopleCount;
    } else {
      price = selectedExperiences.reduce((sum, item) => sum + item.price, 0) * peopleCount;
    }
    
    setTotalPrice(price);
    
    // Calculate discount
    let discountPercent = 0;
    let appliedDiscountInfo = null;
    
    if (peopleCount >= 5) {
      if (peopleCount >= 20) {
        discountPercent = 20;
        appliedDiscountInfo = groupDiscounts[2];
      } else if (peopleCount >= 10) {
        discountPercent = 15;
        appliedDiscountInfo = groupDiscounts[1];
      } else {
        discountPercent = 10;
        appliedDiscountInfo = groupDiscounts[0];
      }
    }
    
    setAppliedDiscount(appliedDiscountInfo);
    const discountAmount = (price * discountPercent) / 100;
    setDiscount(discountAmount);
    setFinalPrice(price - discountAmount);
  }, [selectedExperiences, selectedPass, peopleCount]);
  
  // Handle booking
  const handleBookNow = () => {
    if (!isAuthenticated) {
      dispatch(openModal('LOGIN'));
      return;
    }
    setIsPaymentOpen(true);
  };
  
  return (
    <div className="w-full mt-20 bg-gray-900 rounded-2xl p-8">
      <h2 className="text-white text-3xl font-bold text-center mb-6">{t.pricingCalculator}</h2>
      <p className="text-gray-300 text-center mb-8">{t.calculateCost}</p>
      
      {/* Tab selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-full p-1 flex">
          <button
            onClick={() => {
              setSelectedTab('experiences');
              setSelectedPass(null);
            }}
            className={`px-6 py-3 rounded-full transition-all ${
              selectedTab === 'experiences'
                ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white font-bold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t.individualExperiences}
          </button>
          <button
            onClick={() => {
              setSelectedTab('passes');
              setSelectedExperiences([]);
            }}
            className={`px-6 py-3 rounded-full transition-all ${
              selectedTab === 'passes'
                ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white font-bold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t.hourlyDailyPasses}
          </button>
        </div>
      </div>
      
      {/* Individual Experiences Selection */}
      {selectedTab === 'experiences' && (
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">{t.selectExperiences}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((experience) => (
              <div 
                key={experience.id}
                onClick={() => handleExperienceSelect(experience.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedExperiences.some(e => e.experienceId === experience.id)
                    ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">{experience.name}</h4>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-300">1 {t.singleSession}: ${experience.price1}</span>
                    {!experience.isPhoto && (
                      <span className="text-sm text-gray-300">2 {t.twoSessions}: ${experience.price2}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Selected Experiences */}
          {selectedExperiences.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white text-xl font-bold mb-4">{t.yourSelectedExperiences}</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                {selectedExperiences.map((item) => (
                  <div key={item.experienceId} className="flex justify-between items-center mb-4 last:mb-0">
                    <div>
                      <h4 className="text-white">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      {!item.isPhoto && (
                        <div className="flex items-center">
                          <label className="text-gray-300 mr-2">{t.sessions}:</label>
                          <select
                            value={item.sessions}
                            onChange={(e) => handleSessionChange(item.experienceId, parseInt(e.target.value))}
                            className="bg-gray-700 text-white rounded px-2 py-1"
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                          </select>
                        </div>
                      )}
                      <div className="text-white font-bold w-20 text-right">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Passes Selection */}
      {selectedTab === 'passes' && (
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">{t.selectPass}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hourlyPasses.map((pass) => (
              <div 
                key={pass.id}
                onClick={() => handlePassSelect(pass.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedPass === pass.id
                    ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex flex-col">
                  <h4 className="text-white font-medium">{pass.name}</h4>
                  <p className="text-gray-300 text-sm">{pass.description}</p>
                  <p className="text-white font-bold mt-2">${pass.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* People Count */}
      <div className="mb-8">
        <h3 className="text-white text-xl font-bold mb-4">{t.numberOfPeople}</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePeopleCountChange(peopleCount - 1)}
            className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            disabled={peopleCount <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={peopleCount}
            onChange={(e) => handlePeopleCountChange(parseInt(e.target.value) || 1)}
            className="bg-gray-800 text-white text-center w-16 py-2 rounded-lg"
          />
          <button
            onClick={() => handlePeopleCountChange(peopleCount + 1)}
            className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
          >
            +
          </button>
          
          {appliedDiscount && (
            <div className="ml-4 bg-green-900 text-green-300 px-4 py-1 rounded-full text-sm">
              {appliedDiscount.name}: {appliedDiscount.discount}% discount applied!
            </div>
          )}
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-white text-xl font-bold mb-4">{t.priceSummary}</h3>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">{t.subtotal}:</span>
          <span className="text-white">${totalPrice.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">{t.groupDiscount} ({appliedDiscount.discount}%):</span>
            <span className="text-green-400">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-4 border-t border-gray-700 mt-4">
          <span className="text-white font-bold">{t.totalTaxIncluded}:</span>
          <span className="text-white font-bold text-xl">${finalPrice.toFixed(2)}</span>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-[#DB1FEB] text-sm">{t.allInclusivePricing} - {t.whatYouSeeIsWhatYouPay}</p>
        </div>
      </div>
      
      {/* Book Now Button */}
      <div className="text-center">
        <button
          onClick={handleBookNow}
          disabled={selectedExperiences.length === 0 && !selectedPass}
          className={`text-xl font-semibold flex items-center justify-center mx-auto py-4 px-12 gap-3 text-white rounded-full ${
            selectedExperiences.length === 0 && !selectedPass
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] hover:opacity-90'
          }`}
        >
          {t.bookNow}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          entity={0}
          userId={userData?.user_id || 0}
          amount={finalPrice.toFixed(2)}
          onSuccess={() => { dispatch(fetchUserData()); setIsPaymentOpen(false); router.push('/bookings'); }}
          onRedeemSuccess={() => { dispatch(fetchUserData()); setIsPaymentOpen(false); router.push('/bookings'); }}
          type="booking"
        />
      )}
    </div>
  );
};

export default PricingCalculator; 