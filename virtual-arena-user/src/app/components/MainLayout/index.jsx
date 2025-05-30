'use client';
import Connected from '@/app/components/Connected';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import React from 'react';

const MainLayout = ({children,btnTitle,title}) => {
  return (
    <>
      <div className="relative">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <div className="h-[400px] overflow-x-hidden relative -mt-[90px] md:-mt-[110px]">
          {/* Background Images */}
          <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#00000000] to-[#00000080] bg-opacity-50"></div>
          <img src="/assets/header.png" alt="" className="absolute z-0 top-0 w-full h-full" />
          <img src="/assets/header2.png" alt="" className="absolute z-0 top-0 w-full h-full" />

          {/* Hero Content */}
          <div className={`bg-herobg bg-center bg-no-repeat bg-cover h-[400px] overflow-hidden`}>
            <div id={title} className={`relative w-full h-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6`}>
              <div className="w-full max-w-[1087px] mx-auto h-full">
                <div className="flex flex-col w-full h-full justify-center items-center mt-16 md:items-start">
                  {/* Orders Button */}
                  <button className="bg-white text-black px-6 py-2.5 mx-auto leading-none text-xl font-semibold rounded-xl mb-5">
                    {btnTitle}
                  </button>

                  {/* Page Title */}
                  <h1 className="text-white text-[50px] mb-6 w-full md:text-[70px] leading-none font-bold text-center text-wrap">
                    {title}
                  </h1>

                  {/* Additional Content (if needed) */}
                  <div className="flex flex-col md:flex-row items-center mt-6 gap-3 w-full justify-center">
                    {/* Add additional content here if needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
       {children}

        {/* Connected Section */}
        <Connected />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;