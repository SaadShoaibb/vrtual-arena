'use client'
import React, { useState, useRef } from 'react'
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa'
import { translations } from '@/app/translations'
import { getMediaBaseUrl } from '@/utils/ApiUrl'

const VirtualTour = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);

    // Get the proper media base URL for deployment
    const mediaBaseUrl = getMediaBaseUrl();

    const handlePlayPause = (videoRef) => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleFullscreen = (videoRef) => {
        if (videoRef.current) {
            if (!isFullscreen) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                } else if (videoRef.current.webkitRequestFullscreen) {
                    videoRef.current.webkitRequestFullscreen();
                } else if (videoRef.current.msRequestFullscreen) {
                    videoRef.current.msRequestFullscreen();
                }
                setIsFullscreen(true);
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div id='virtual-tour' className="w-full h-full bg-blackish">
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='text-center mb-12'>
                    <h1 className='text-gradiant text-[26px] font-semibold'>{t.virtualTour}</h1>
                    <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>{t.virtualTourDesc}</h1>
                    <p className='text-white text-lg font-light max-w-[720px] mt-3 mx-auto'>
                        {t.virtualTourDescription || 'Get an immersive preview of our VR arena and facilities before your visit. See our state-of-the-art equipment and spacious gaming areas.'}
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12'>
                    {/* Virtual Tour Video */}
                    <div className='w-full'>
                        <div className='relative rounded-xl overflow-hidden bg-gray-900 shadow-lg'>
                            {videoError ? (
                                <div className="w-full h-[300px] md:h-[400px] bg-gray-800 flex items-center justify-center rounded-xl">
                                    <div className="text-center text-white">
                                        <p className="text-lg font-semibold mb-2">Video Unavailable</p>
                                        <p className="text-sm text-gray-300">The virtual tour video is currently being updated.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {!videoLoaded && (
                                        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
                                            <div className="text-white">Loading video...</div>
                                        </div>
                                    )}
                                    <video
                                        ref={videoRef}
                                        className={`w-full h-[300px] md:h-[400px] object-cover rounded-xl ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                                        poster="/gallery/gal1.png"
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onEnded={() => setIsPlaying(false)}
                                        onError={() => setVideoError(true)}
                                        onLoadedData={() => setVideoLoaded(true)}
                                        onCanPlay={() => setVideoLoaded(true)}
                                        preload="metadata"
                                        playsInline
                                        controls
                                    >
                                        <source src="/gallery/galvid2.mp4" type="video/mp4" />
                                        <source src="/gallery/galvid2.webm" type="video/webm" />
                                        Your browser does not support the video tag.
                                    </video>
                                </>
                            )}
                            
                            {/* Custom Controls Overlay */}
                            <div className='absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/50 rounded-lg p-3'>
                                <button
                                    onClick={() => handlePlayPause(videoRef)}
                                    className='flex items-center space-x-2 text-white hover:text-[#DB1FEB] transition-colors'
                                >
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                    <span className='text-sm'>{isPlaying ? t.pause || 'Pause' : t.play || 'Play'}</span>
                                </button>

                                <button
                                    onClick={() => handleFullscreen(videoRef)}
                                    className='flex items-center space-x-2 text-white hover:text-[#DB1FEB] transition-colors'
                                >
                                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                                    <span className='text-sm'>{isFullscreen ? t.exitFullscreen || 'Exit' : t.fullscreen || 'Fullscreen'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tour Information */}
                    <div className='w-full'>
                        <h2 className='text-white text-[30px] md:text-[35px] font-bold mb-6'>
                            {t.exploreOurFacility || 'Explore Our Facility'}
                        </h2>
                        
                        <div className='space-y-6'>
                            {/* Arena Features */}
                            <div className='bg-gray-900 rounded-xl p-6'>
                                <h3 className='text-[#DB1FEB] text-xl font-semibold mb-3'>{t.spaciousArena}</h3>
                                <p className='text-white text-lg font-light'>
                                    {t.spaciousArenaDesc}
                                </p>
                            </div>

                            {/* Lounge Area */}
                            <div className='bg-gray-900 rounded-xl p-6'>
                                <h3 className='text-[#DB1FEB] text-xl font-semibold mb-3'>{t.loungeArea}</h3>
                                <p className='text-white text-lg font-light'>
                                    {t.loungeAreaDesc}
                                </p>
                            </div>

                            {/* Snacks & Beverages */}
                            <div className='bg-gray-900 rounded-xl p-6'>
                                <h3 className='text-[#DB1FEB] text-xl font-semibold mb-3'>{t.snacksAndBeverages}</h3>
                                <p className='text-white text-lg font-light'>
                                    {t.snacksDesc}
                                </p>
                            </div>

                            {/* Premium Equipment */}
                            <div className='bg-gray-900 rounded-xl p-6'>
                                <h3 className='text-[#DB1FEB] text-xl font-semibold mb-3'>{t.premiumEquipment}</h3>
                                <p className='text-white text-lg font-light'>
                                    {t.premiumEquipmentDesc}
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className='mt-8'>
                            <button className='text-xl font-semibold flex items-center py-4 px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] hover:shadow-lg hover:shadow-purple-500/25 transition-all'>
                                {t.bookYourVisit || 'Book Your Visit'}
                                <img src="/icons/arrow.svg" alt="Arrow icon" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VirtualTour
