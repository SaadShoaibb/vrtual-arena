'use client'
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus, FaShieldAlt, FaCertificate, FaUsers, FaBuilding } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import { translations } from '@/app/translations';

// Define team members using translations
const getTeamMembers = (t) => [
  {
    name: t.teamMember1Name || 'Ahmed Abouda',
    role: t.teamMember1Role || 'Founder & CEO',
    bio: t.teamMember1Bio || 'With over 15 years in the tech industry, Ahmed founded VRtual Arena to bring cutting-edge VR experiences to Edmonton. His vision drives our commitment to innovation and exceptional customer experiences.',
    image: '/assets/team/ahmed.jpg'
  },
  {
    name: t.teamMember2Name || 'Sarah Reynolds',
    role: t.teamMember2Role || 'Operations Manager',
    bio: t.teamMember2Bio || 'Sarah ensures our day-to-day operations run smoothly and that every customer receives a memorable experience. Her background in hospitality and technology brings the perfect blend of skills to our team.',
    image: '/assets/team/sarah.jpg'
  },
  {
    name: t.teamMember3Name || 'Michael Chen',
    role: t.teamMember3Role || 'Technical Director',
    bio: t.teamMember3Bio || 'Michael oversees all our VR systems and equipment. With extensive experience in VR/AR development, he ensures our technology delivers flawless, immersive experiences every time.',
    image: '/assets/team/michael.jpg'
  },
  {
    name: t.teamMember4Name || 'Jasmine Patel',
    role: t.teamMember4Role || 'Customer Experience Lead',
    bio: t.teamMember4Bio || 'Jasmine and her team of VR guides make sure every visitor has an incredible time. From first-timers to VR enthusiasts, she ensures everyone gets the most out of their experience.',
    image: '/assets/team/jasmine.jpg'
  }
];

// Define FAQs using translations
const getFAQs = (t) => [
  {
    question: t.faq1Question || 'Is there an age requirement for VR experiences?',
    answer: t.faq1Answer || 'Most of our experiences are suitable for ages 8 and up. Children under 13 must be accompanied by an adult. We offer special kid-friendly experiences like VR Warrior and VR CAT designed specifically for younger adventurers.'
  },
  {
    question: t.faq2Question || 'Do I need prior VR experience?',
    answer: t.faq2Answer || 'Absolutely not! Our expert guides will provide a full orientation and remain available throughout your experience to ensure you\'re comfortable and having fun.'
  },
  {
    question: t.faq3Question || 'How long do the experiences last?',
    answer: t.faq3Answer || 'Most of our VR experiences run for approximately 15-30 minutes, depending on the specific attraction. The Free-Roaming Arena sessions are 30 minutes.'
  },
  {
    question: t.faq4Question || 'Is VR safe for everyone?',
    answer: t.faq4Answer || 'Most people can enjoy VR without issues. However, if you have certain medical conditions (epilepsy, severe motion sickness, etc.), are pregnant, or have severe balance issues, please consult your doctor before participating. We prioritize safety and comfort.'
  },
  {
    question: t.faq5Question || 'What should I wear?',
    answer: t.faq5Answer || 'Comfortable clothing and closed-toe shoes are recommended. Avoid skirts or loose clothing that might restrict movement. We provide all necessary VR equipment.'
  },
  {
    question: t.faq6Question || 'Can I book for a large group or private event?',
    answer: t.faq6Answer || 'Yes! We offer special group rates and can arrange private events, birthday parties, and corporate functions. Contact us for details and custom packages.'
  },
  {
    question: t.faq7Question || 'Do I need to make a reservation?',
    answer: t.faq7Answer || 'While walk-ins are welcome based on availability, we highly recommend booking in advance to secure your preferred experience and time slot, especially on weekends and holidays.'
  },
  {
    question: t.faq8Question || 'What is your cancellation policy?',
    answer: t.faq8Answer || 'Bookings can be cancelled or rescheduled up to 24 hours before your session for a full refund. Changes made within 24 hours may be subject to a fee.'
  }
];

const FAQ = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-800 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-semibold text-white">{question}</h3>
        <div className="text-[#DB1FEB] ml-2">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-300">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
  
  // Get translated team members and FAQs
  const teamMembers = getTeamMembers(t);
  const FAQs = getFAQs(t);

  // Define facility features with translations
  const facilityFeatures = [
    {
      title: t.spaciousArena,
      description: t.spaciousArenaDesc,
      icon: <FaBuilding className="text-[#DB1FEB] text-3xl mb-4" />
    },
    {
      title: t.premiumEquipment,
      description: t.premiumEquipmentDesc,
      icon: <FaCertificate className="text-[#DB1FEB] text-3xl mb-4" />
    },
    {
      title: t.comfortZones,
      description: t.comfortZonesDesc,
      icon: <FaUsers className="text-[#DB1FEB] text-3xl mb-4" />
    },
    {
      title: t.safetyFirst,
      description: t.safetyFirstDesc,
      icon: <FaShieldAlt className="text-[#DB1FEB] text-3xl mb-4" />
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <div className="bg-black text-white">
        <Navbar locale={locale} />
        
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-[#1a1a1a] to-black">
          <div className="absolute inset-0">
            <img src="/assets/contactbg.png" alt="VRtual Arena About Us" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t.aboutTitle}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.aboutDescription}
            </p>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 md:py-24 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">{t.ourStory}</h2>
                <div className="space-y-4 text-gray-300">
                  <p>{t.storyDescription1}</p>
                  <p>{t.storyDescription2}</p>
                  <p>{t.storyDescription3}</p>
                </div>
                
                <h2 className="text-3xl font-bold mt-12 mb-6 text-white">{t.ourMission}</h2>
                <div className="space-y-4 text-gray-300">
                  <p>{t.missionStatement1}</p>
                  <p>{t.missionStatement2}</p>
                  <p>{t.missionStatement3}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Facility */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.ourFacility}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t.facilityDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facilityFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-6 text-center hover:shadow-[0_0_20px_rgba(219,31,235,0.2)] transition-shadow duration-300">
                  {feature.icon}
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-gray-900 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-white">{t.virtualTour}</h3>
                <p className="text-gray-300 mb-6">
                  {t.virtualTourDesc}
                </p>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-xl font-bold text-white mb-4">{t.comingSoon}</p>
                    <p className="text-gray-300">
                      {t.tourUpdateMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Meet Our Team */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.meetOurTeam}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t.teamDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(219,31,235,0.2)] transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                    <p className="text-[#DB1FEB] font-medium mb-4">{member.role}</p>
                    <p className="text-gray-300 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Safety Information */}
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">{t.safetyInformation}</h2>
                <div className="space-y-4 text-gray-300">
                  <p>{t.safetyPara1}</p>
                  <p>{t.safetyPara2}</p>
                  <p>{t.safetyPara3}</p>
                  <p>{t.safetyPara4}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <img src="/assets/safety.jpg" alt="Safety at VRtual Arena" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.faqTitle}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t.faqDescription}
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {FAQs.map((faq, index) => (
                <FAQ
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  toggleOpen={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </section>
        
        <Footer locale={locale} />
      </div>
    </>
  );
} 