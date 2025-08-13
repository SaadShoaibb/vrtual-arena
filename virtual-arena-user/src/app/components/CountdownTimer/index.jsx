'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { translations } from '@/app/translations';
import { useSearchParams } from 'next/navigation';

const CountdownTimer = () => {
    const searchParams = useSearchParams();
    const locale = searchParams?.get('locale') || 'en';
    const t = translations[locale] || translations.en;
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [targetDate, setTargetDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(true);

    // Fetch countdown target date and enabled status from API
    const fetchCountdownSettings = useCallback(async () => {
            console.log('🔄 Fetching countdown settings...');
            try {
                // Import API_URL dynamically to avoid SSR issues
                const { API_URL } = await import('@/utils/ApiUrl');

                // Fetch countdown date directly from backend
                console.log('📅 Fetching countdown date...');
                const dateResponse = await fetch(`${API_URL}/admin/site-settings/grand_opening_date?t=${Date.now()}`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                let countdownDate = null;

                console.log('📅 Date response status:', dateResponse.status);
                if (dateResponse.ok) {
                    const dateData = await dateResponse.json();
                    console.log('📅 Date data:', dateData);
                    if (dateData.success && (dateData.date || dateData.setting?.setting_value)) {
                        const dateValue = dateData.date || dateData.setting.setting_value;
                        countdownDate = new Date(dateValue);
                        console.log('📅 Parsed countdown date:', countdownDate);
                    }
                } else {
                    console.error('❌ Failed to fetch countdown date:', dateResponse.status);
                }

                // Fetch enabled status directly from backend
                console.log('🔘 Fetching enabled status...');
                const enabledResponse = await fetch(`${API_URL}/admin/site-settings/countdown_enabled?t=${Date.now()}`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                let enabled = true; // Default to enabled

                console.log('🔘 Enabled response status:', enabledResponse.status);
                if (enabledResponse.ok) {
                    const enabledData = await enabledResponse.json();
                    console.log('🔘 Enabled data:', enabledData);
                    if (enabledData.success !== false) { // Only disable if explicitly false
                        const enabledValue = enabledData.setting?.setting_value || enabledData.enabled;
                        enabled = enabledValue === true || enabledValue === 'true';
                        console.log('🔘 Final enabled value:', enabled);
                    } else {
                        console.warn('⚠️ API returned success: false, keeping enabled as default true');
                    }
                } else {
                    console.error('❌ Failed to fetch enabled status:', enabledResponse.status);
                    console.log('🔘 Keeping enabled as default true due to fetch failure');
                }

                console.log('✅ Setting enabled status:', enabled);
                setIsEnabled(enabled);

                if (countdownDate && !isNaN(countdownDate.getTime())) {
                    console.log('✅ Setting target date:', countdownDate);
                    setTargetDate(countdownDate);
                } else {
                    // Fallback to 100 days from now
                    console.log('⚠️ Using fallback date (100 days from now)');
                    const fallbackDate = new Date();
                    fallbackDate.setDate(fallbackDate.getDate() + 100);
                    setTargetDate(fallbackDate);
                }
            } catch (error) {
                console.error('❌ Error fetching countdown settings:', error);
                // Fallback to 100 days from now
                const fallbackDate = new Date();
                fallbackDate.setDate(fallbackDate.getDate() + 100);
                setTargetDate(fallbackDate);
                setIsEnabled(true);
            } finally {
                console.log('✅ Countdown settings fetch complete');
                setIsLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchCountdownSettings();
    }, [fetchCountdownSettings]);

    // Refresh countdown settings every 30 seconds to get admin updates
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔄 Refreshing countdown settings...');
            fetchCountdownSettings();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [fetchCountdownSettings]);

    // Update countdown every second
    useEffect(() => {
        if (!targetDate) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const target = targetDate.getTime();
            const difference = target - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Don't render if disabled
    if (!isEnabled) {
        console.log('❌ Countdown timer disabled, not rendering. isEnabled:', isEnabled);
        return null;
    }

    if (isLoading) {
        console.log('⏳ Countdown timer loading...');
        return (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-4 md:py-6">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse">
                        <div className="h-6 md:h-8 bg-white/20 rounded mb-2 md:mb-4 mx-auto max-w-xs"></div>
                        <div className="h-12 md:h-16 bg-white/20 rounded mx-auto max-w-md"></div>
                    </div>
                    <p className="text-white/70 text-sm mt-2">Loading countdown...</p>
                </div>
            </div>
        );
    }

    // Always render something for debugging
    if (!targetDate) {
        console.log('❌ No target date set, showing fallback');
        return (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-4 md:py-6">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                        🎉 Grand Opening Coming Soon!
                    </h2>
                    <p className="text-white/90 text-sm">
                        Stay tuned for the ultimate VR experience!
                    </p>
                </div>
            </div>
        );
    }

    console.log('✅ Rendering countdown timer with:', { isEnabled, targetDate, timeLeft });

    return (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-3 md:py-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="flex items-center justify-center gap-4 mb-1 md:mb-2">
                    <h2 className="text-lg md:text-xl font-bold text-white">
                        {t.grandOpeningCountdown || '🎉 Grand Opening Countdown'}
                    </h2>
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => {
                                console.log('🔄 Manual refresh triggered');
                                fetchCountdownSettings();
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs"
                            title="Refresh countdown (dev only)"
                        >
                            🔄
                        </button>
                    )}
                </div>
                <div className="hidden md:block">
                    <p className="text-white/90 mb-3 text-sm">
                        {t.countdownDescription || 'Get ready for the ultimate VR experience!'}
                    </p>
                </div>

                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                    {/* Days */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/20">
                        <div className="text-xl md:text-3xl font-bold text-white">
                            {timeLeft.days.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                            {t.days || 'Days'}
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/20">
                        <div className="text-xl md:text-3xl font-bold text-white">
                            {timeLeft.hours.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                            {t.hours || 'Hours'}
                        </div>
                    </div>

                    {/* Minutes */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/20">
                        <div className="text-xl md:text-3xl font-bold text-white">
                            {timeLeft.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                            {t.minutes || 'Minutes'}
                        </div>
                    </div>

                    {/* Seconds */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/20">
                        <div className="text-xl md:text-3xl font-bold text-white">
                            {timeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                            {t.seconds || 'Seconds'}
                        </div>
                    </div>
                </div>

                <div className="mt-2 md:mt-3 hidden md:block">
                    <p className="text-white/90 text-xs md:text-sm">
                        {t.stayTuned || 'Stay tuned for an incredible VR adventure!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
