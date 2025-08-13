'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

const CountdownTimerPage = () => {
    const [grandOpeningDate, setGrandOpeningDate] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCountdownSettings();

        // Clean up browser extension attributes to prevent hydration errors
        const cleanupExtensionAttributes = () => {
            const elements = document.querySelectorAll('[bis_skin_checked], [__processed_b9465c6f-55aa-4ef9-968a-4e66b4b9af51__], [bis_register]');
            elements.forEach(el => {
                el.removeAttribute('bis_skin_checked');
                el.removeAttribute('__processed_b9465c6f-55aa-4ef9-968a-4e66b4b9af51__');
                el.removeAttribute('bis_register');
            });
        };

        // Clean up after component mounts
        setTimeout(cleanupExtensionAttributes, 100);
    }, []);

    const fetchCountdownSettings = async () => {
        try {
            console.log('🔄 Fetching countdown settings...');
            const response = await axios.get(`${API_URL}/admin/site-settings/grand_opening_date`, getAuthHeaders());
            console.log('📅 Date response:', response.data);

            if (response.data.success) {
                // Handle both response formats
                const date = response.data.setting?.setting_value || response.data.date;
                console.log('📅 Retrieved date:', date);
                if (date) {
                    // Convert to local datetime format for input
                    const localDate = new Date(date);
                    const formattedDate = localDate.toISOString().slice(0, 16);
                    console.log('📅 Formatted date for input:', formattedDate);
                    setGrandOpeningDate(formattedDate);
                }
            }

            const enabledResponse = await axios.get(`${API_URL}/admin/site-settings/countdown_enabled`, getAuthHeaders());
            console.log('🔘 Enabled response:', enabledResponse.data);

            if (enabledResponse.data.success) {
                const enabled = enabledResponse.data.setting?.setting_value === 'true';
                console.log('🔘 Enabled status:', enabled);
                setIsEnabled(enabled);
            }
        } catch (error) {
            console.error('❌ Error fetching countdown settings:', error);
            toast.error('Failed to fetch countdown settings');
        } finally {
            setLoading(false);
        }
    };

    const saveCountdownSettings = async () => {
        if (!grandOpeningDate) {
            toast.error('Please select a grand opening date');
            return;
        }

        setSaving(true);
        try {
            console.log('💾 Saving countdown settings...');
            console.log('📅 Date to save:', grandOpeningDate);
            console.log('🔘 Enabled to save:', isEnabled);

            // Save grand opening date
            const dateResponse = await axios.put(
                `${API_URL}/admin/site-settings/grand_opening_date`,
                {
                    value: new Date(grandOpeningDate).toISOString(),
                    type: 'date',
                    description: 'Grand opening countdown target date'
                },
                getAuthHeaders()
            );
            console.log('📅 Date save response:', dateResponse.data);

            // Save enabled status
            const enabledResponse = await axios.put(
                `${API_URL}/admin/site-settings/countdown_enabled`,
                {
                    value: isEnabled.toString(),
                    type: 'boolean',
                    description: 'Enable/disable countdown banner'
                },
                getAuthHeaders()
            );
            console.log('🔘 Enabled save response:', enabledResponse.data);

            toast.success('Countdown settings saved successfully');

            // Refetch to confirm save
            setTimeout(() => {
                fetchCountdownSettings();
            }, 1000);
        } catch (error) {
            console.error('❌ Error saving countdown settings:', error);
            toast.error('Failed to save countdown settings');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefault = () => {
        // Set to 100 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 100);
        const formattedDate = futureDate.toISOString().slice(0, 16);
        setGrandOpeningDate(formattedDate);
        setIsEnabled(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Countdown Timer Management</h1>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Enable/Disable Toggle */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Enable Countdown Timer</h3>
                                <p className="text-sm text-gray-500">Show countdown timer above the navigation bar</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={(e) => setIsEnabled(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Grand Opening Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grand Opening Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={grandOpeningDate}
                                onChange={(e) => setGrandOpeningDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Select the date and time for your grand opening
                            </p>
                        </div>

                        {/* Preview */}
                        {grandOpeningDate && isEnabled && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                                <CountdownPreview targetDate={grandOpeningDate} />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={saveCountdownSettings}
                                disabled={saving}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                            <button
                                onClick={resetToDefault}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Reset to 100 Days
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• The countdown timer will appear above the navigation bar on all pages</li>
                                <li>• When disabled, the countdown timer will be hidden from the website</li>
                                <li>• The timer automatically updates every second</li>
                                <li>• After the target date passes, the timer will show "Grand Opening!"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Preview component to show how the countdown will look
const CountdownPreview = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ expired: true });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.expired) {
        return (
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 rounded-lg text-center">
                <span className="text-lg font-bold">🎉 Grand Opening! 🎉</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg">
            <div className="text-center">
                <div className="text-sm font-medium mb-1">Grand Opening Countdown</div>
                <div className="flex justify-center space-x-4 text-lg font-bold">
                    <div className="text-center">
                        <div>{timeLeft.days || 0}</div>
                        <div className="text-xs">Days</div>
                    </div>
                    <div className="text-center">
                        <div>{timeLeft.hours || 0}</div>
                        <div className="text-xs">Hours</div>
                    </div>
                    <div className="text-center">
                        <div>{timeLeft.minutes || 0}</div>
                        <div className="text-xs">Minutes</div>
                    </div>
                    <div className="text-center">
                        <div>{timeLeft.seconds || 0}</div>
                        <div className="text-xs">Seconds</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimerPage;
