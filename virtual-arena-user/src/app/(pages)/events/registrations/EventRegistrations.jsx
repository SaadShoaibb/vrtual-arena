'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl'
import toast from 'react-hot-toast'
import { translations } from '@/app/translations'
import { formatDisplayPrice } from '@/app/utils/currency'

const EventRegistrations = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { isAuthenticated } = useSelector(state => state.userData)

    useEffect(() => {
        if (isAuthenticated) {
            fetchEventRegistrations()
        }
    }, [isAuthenticated])

    const fetchEventRegistrations = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/user/event-registrations/`, getAuthHeaders())
            setRegistrations(response.data.registrations || [])
        } catch (err) {
            console.error('Error fetching event registrations:', err)
            setError('Failed to fetch event registrations')
            toast.error('Failed to fetch event registrations')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelRegistration = async (registration) => {
        if (!confirm('Are you sure you want to cancel this event registration?')) {
            return
        }

        try {
            await axios.delete(`${API_URL}/user/cancel-event-registration/${registration.registration_id}`, getAuthHeaders())
            toast.success('Event registration cancelled successfully')
            fetchEventRegistrations() // Refresh the list
        } catch (err) {
            console.error('Error cancelling registration:', err)
            toast.error('Failed to cancel registration')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'registered':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-blackish text-white min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your event registrations</h2>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="bg-blackish text-white min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB1FEB] mx-auto mb-4"></div>
                    <p>Loading your event registrations...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-blackish text-white min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-blackish text-white min-h-[60vh]">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">My Event Registrations</h1>
                
                {registrations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold mb-4">No Event Registrations Yet</h2>
                        <p className="text-gray-400 mb-6">You haven't registered for any events yet.</p>
                        <a 
                            href={`/events?locale=${locale}`}
                            className="bg-grad text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Browse Events
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {registrations.map((registration) => (
                            <div key={registration.registration_id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#DB1FEB] mb-2">{registration.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Start Date:</p>
                                                <p className="text-white">{formatDate(registration.start_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">End Date:</p>
                                                <p className="text-white">{formatDate(registration.end_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Location:</p>
                                                <p className="text-white">{registration.city}, {registration.state}, {registration.country}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Registration Date:</p>
                                                <p className="text-white">{formatDate(registration.registration_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Payment Status:</p>
                                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                                    registration.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {registration.payment_status?.charAt(0).toUpperCase() + registration.payment_status?.slice(1)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Payment Option:</p>
                                                <p className="text-white">{registration.payment_option === 'at_event' ? 'Pay at Event' : 'Online Payment'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                                            {registration.status?.charAt(0).toUpperCase() + registration.status?.slice(1)}
                                        </span>
                                        {registration.status === 'registered' && (
                                            <button
                                                onClick={() => handleCancelRegistration(registration)}
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Cancel Registration
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventRegistrations
