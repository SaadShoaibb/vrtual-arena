'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaQuoteLeft } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';

const experiences = [
  {
    id: 'free-roaming',
    title: 'Free-Roaming Arena',
    description: 'Immerse yourself in our expansive free-roaming VR space where you can explore and interact with virtual worlds.',
    image: '/assets/free-roaming.png',
    price: '$12',
    path: '/experiences/free-roaming-arena'
  },
  {
    id: 'ufo',
    title: 'UFO Spaceship',
    description: 'Experience the thrill of piloting a UFO through space in this unique motion-based VR adventure.',
    image: '/assets/ufo.png',
    price: '$9',
    path: '/experiences/ufo-spaceship'
  },
  {
    id: 'vr360',
    title: 'VR 360',
    description: 'Sit back and be transported to incredible destinations with our immersive 360-degree VR experiences.',
    image: '/assets/vr360.png',
    price: '$9',
    path: '/experiences/vr-360'
  },
  {
    id: 'vrbattle',
    title: 'VR Battle',
    description: 'Test your combat skills in thrilling VR battles against friends or AI opponents.',
    image: '/assets/vrbattle.png',
    price: '$9',
    path: '/experiences/vr-battle'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Michael Thompson',
    rating: 5,
    text: 'The free-roaming arena was mind-blowing! I felt like I was actually in another world. Staff was super helpful and friendly. Will definitely be back!',
    image: '/assets/testimonial1.jpg'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Brought my kids for the VR Warrior experience and they absolutely loved it! Safe, fun, and surprisingly educational. The all-inclusive pricing was a nice bonus too!',
    image: '/assets/testimonial2.jpg'
  },
  {
    id: 3,
    name: 'David Chen',
    rating: 4,
    text: 'The UFO Spaceship was unlike anything I\'ve ever experienced before. The motion combined with VR created a truly immersive adventure.',
    image: '/assets/testimonial3.jpg'
  },
];

const promotions = [
  {
    id: 'promo1',
    title: 'Weekend Special',
    description: 'Get 15% off when you book any two experiences for the weekend',
    endDate: 'Valid until June 30, 2023',
    image: '/assets/promo1.jpg',
    bgColor: 'from-purple-600 to-blue-500'
  },
  {
    id: 'promo2',
    title: 'Family Package',
    description: 'Book for 4+ people and receive a complimentary photo session',
    endDate: 'Limited time offer',
    image: '/assets/promo2.jpg',
    bgColor: 'from-pink-500 to-orange-400'
  },
  {
    id: 'promo3',
    title: 'New Member Discount',
    description: 'First-time visitors receive 10% off any experience',
    endDate: 'Ongoing promotion',
    image: '/assets/promo3.jpg',
    bgColor: 'from-green-500 to-teal-400'
  }
];

const ExperienceCard = ({ title, description, image, price, path }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(219,31,235,0.3)] transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-[#DB1FEB] text-white px-4 py-1 rounded-bl-lg font-bold">
          {price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <Link 
          href={path}
          className="inline-flex items-center text-[#DB1FEB] hover:text-[#24CBFF] transition-colors font-semibold"
        >
          Learn More <MdArrowForward className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const TestimonialCard = ({ name, rating, text, image }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg relative">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={image || '/assets/default-avatar.jpg'} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = '/assets/default-avatar.jpg'}}
          />
        </div>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"} />
            ))}
          </div>
        </div>
      </div>
      <FaQuoteLeft className="text-gray-700 absolute top-6 right-6 text-4xl opacity-20" />
      <p className="text-gray-300 italic">{text}</p>
    </div>
  );
};

const PromotionCard = ({ title, description, endDate, image, bgColor }) => {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg relative`}>
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${bgColor} opacity-70 z-0`}></div>
      <img 
        src={image || '/assets/default-promo.jpg'} 
        alt={title} 
        className="w-full h-full object-cover absolute inset-0"
        onError={(e) => {e.target.src = '/assets/default-promo.jpg'}}
      />
      <div className="p-6 relative z-20 h-full flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white mb-2">{description}</p>
        <p className="text-sm text-gray-200">{endDate}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-screen max-h-[800px] overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            className="absolute w-full h-full object-cover"
            poster="/assets/hero-poster.jpg"
          >
            <source src="/assets/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Step into the New Reality
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience virtual worlds like never before with Edmonton's premier VR entertainment center
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="/experiences/free-roaming-arena" 
                className="bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white text-lg font-bold py-4 px-8 rounded-full"
              >
                Book Now
              </Link>
              <Link 
                href="/experiences" 
                className="border-2 border-white hover:bg-white hover:text-black transition-colors text-white text-lg font-bold py-4 px-8 rounded-full"
              >
                Explore Experiences
              </Link>
            </motion.div>
          </div>
          
          {/* Quick Info Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-around items-center text-center">
              <div className="flex items-center px-4 py-2">
                <FaMapMarkerAlt className="text-[#DB1FEB] mr-2 text-xl" />
                <span className="text-gray-200">8109 102 street Edmonton, Alberta</span>
              </div>
              <div className="flex items-center px-4 py-2">
                <FaClock className="text-[#DB1FEB] mr-2 text-xl" />
                <span className="text-gray-200">Open Daily 10AM - 10PM</span>
              </div>
              <div className="flex items-center px-4 py-2">
                <FaPhone className="text-[#DB1FEB] mr-2 text-xl" />
                <span className="text-gray-200">780-123-4567</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          
          {/* Featured Experiences */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Experiences</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Discover our most popular virtual reality adventures, each offering a unique and immersive experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} {...exp} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link
                href="/experiences"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 transition-colors text-white font-bold py-3 px-6 rounded-full"
              >
                View All Experiences <MdArrowForward className="ml-2" />
              </Link>
            </div>
          </section>
          
          {/* All-Inclusive Pricing */}
          <section className="mb-20 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">All-Inclusive Pricing</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                What you see is what you pay. All prices include taxes and fees - no surprises at checkout.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Single Sessions</h3>
                <p className="text-gray-300 mb-6">Perfect for first-time visitors or quick adventures</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex justify-between">
                    <span>Free-Roaming Arena</span>
                    <span className="font-bold">$12</span>
                  </li>
                  <li className="flex justify-between">
                    <span>UFO Spaceship</span>
                    <span className="font-bold">$9</span>
                  </li>
                  <li className="flex justify-between">
                    <span>VR 360</span>
                    <span className="font-bold">$9</span>
                  </li>
                  <li className="flex justify-between">
                    <span>VR Battle</span>
                    <span className="font-bold">$9</span>
                  </li>
                </ul>
                <Link
                  href="/pricing"
                  className="inline-block bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white font-bold py-2 px-6 rounded-full"
                >
                  View Details
                </Link>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 text-center relative overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(219,31,235,0.3)]">
                <div className="absolute top-0 right-0 bg-[#DB1FEB] text-white px-4 py-1 rounded-bl-lg font-bold">
                  Popular
                </div>
                <h3 className="text-xl font-bold mb-4">Memberships</h3>
                <p className="text-gray-300 mb-6">Best value for regular visitors with amazing perks</p>
                <div className="text-left space-y-3 mb-8">
                  <p className="flex justify-between">
                    <span>Basic</span>
                    <span className="font-bold">$49.99/mo</span>
                  </p>
                  <p className="text-sm text-gray-400">4 free sessions + 10% off</p>
                  
                  <p className="flex justify-between pt-2">
                    <span>Premium</span>
                    <span className="font-bold">$79.99/mo</span>
                  </p>
                  <p className="text-sm text-gray-400">8 sessions + 15% off</p>
                  
                  <p className="flex justify-between pt-2">
                    <span>Ultimate</span>
                    <span className="font-bold">$129.99/mo</span>
                  </p>
                  <p className="text-sm text-gray-400">12 sessions + 20% off</p>
                </div>
                <Link
                  href="/pricing"
                  className="inline-block bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white font-bold py-2 px-6 rounded-full"
                >
                  View All Plans
                </Link>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Group & Events</h3>
                <p className="text-gray-300 mb-6">Special packages for parties, corporate events, and groups</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex justify-between">
                    <span>Family Pack (4 people)</span>
                    <span className="font-bold">Save 15%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Birthday Package</span>
                    <span className="font-bold">From $199</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Corporate Events</span>
                    <span className="font-bold">Custom</span>
                  </li>
                  <li className="flex justify-between">
                    <span>School Groups</span>
                    <span className="font-bold">Special Rates</span>
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white font-bold py-2 px-6 rounded-full"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it - hear from our satisfied visitors
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
            </div>
          </section>
          
          {/* Latest Promotions */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Promotions</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Take advantage of our special offers and save on your next visit
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
              {promotions.map((promo) => (
                <PromotionCard key={promo.id} {...promo} />
              ))}
            </div>
          </section>
          
          {/* Book Now CTA */}
          <section className="relative rounded-2xl overflow-hidden mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 z-10"></div>
            <img 
              src="/assets/cta-bg.jpg" 
              alt="VR Experience" 
              className="w-full h-full object-cover absolute inset-0"
            />
            
            <div className="relative z-20 py-16 px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Step Into a New Reality?</h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                Book your VR adventure today and experience the future of entertainment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/about" 
                  className="relative overflow-hidden border-2 border-white group text-white text-lg font-bold py-3 px-8 rounded-full transition-all duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Read More About Us</span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                </Link>
                <Link 
                  href="/booking" 
                  className="bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white text-lg font-bold py-3 px-8 rounded-full"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </section>
        </div>
        
        <Footer />
      </div>
    </>
  );
} 