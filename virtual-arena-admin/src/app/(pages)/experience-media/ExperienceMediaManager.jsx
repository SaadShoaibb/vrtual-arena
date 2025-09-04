"use client"
import React, { useState, useEffect } from 'react'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl'
import axios from 'axios'
import toast from 'react-hot-toast'

const ExperienceMediaManager = () => {
    const [experiences, setExperiences] = useState([])
    const [selectedExperience, setSelectedExperience] = useState('')
    const [experienceMedia, setExperienceMedia] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploadingMedia, setUploadingMedia] = useState(false)

    const experienceOptions = [
        { value: 'free-roaming-arena', label: 'Free Roaming Arena' },
        { value: 'vr-battle', label: 'VR Battle' },
        { value: 'ufo-spaceship', label: 'UFO Spaceship' },
        { value: 'vr-360', label: 'VR 360' },
        { value: 'vr-cat', label: 'VR Cat' },
        { value: 'vr-warrior', label: 'VR Warrior' },
        { value: 'photo-booth', label: 'Photo Booth' }
    ]

    useEffect(() => {
        fetchAllExperiences()
    }, [])

    useEffect(() => {
        if (selectedExperience) {
            fetchExperienceMedia(selectedExperience)
        }
    }, [selectedExperience])

    const fetchAllExperiences = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/admin/experience-media`, getAuthHeaders())
            if (response.data.success) {
                setExperiences(response.data.experiences || [])
            }
        } catch (error) {
            console.error('Error fetching experiences:', error)
            // Don't show error toast on initial load
            setExperiences([])
        } finally {
            setLoading(false)
        }
    }

    const fetchExperienceMedia = async (experienceName) => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/admin/experience-media/${experienceName}`, getAuthHeaders())
            if (response.data.success) {
                setExperienceMedia(response.data.media)
            }
        } catch (error) {
            console.error('Error fetching experience media:', error)
            toast.error('Failed to load media')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!selectedExperience) {
            toast.error('Please select an experience first')
            return
        }

        const formData = new FormData()
        formData.append('media', file)
        formData.append('experience_name', selectedExperience)
        formData.append('media_type', file.type.startsWith('video/') ? 'video' : 'image')
        formData.append('media_order', experienceMedia.length + 1)

        try {
            setUploadingMedia(true)
            const response = await axios.post(`${API_URL}/admin/experience-media`, formData, {
                ...getAuthHeaders(),
                headers: {
                    ...getAuthHeaders().headers,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success('Media uploaded successfully')
                fetchExperienceMedia(selectedExperience)
            }
        } catch (error) {
            console.error('Error uploading media:', error)
            toast.error('Failed to upload media')
        } finally {
            setUploadingMedia(false)
        }
    }

    const handleDeleteMedia = async (mediaId) => {
        if (!confirm('Are you sure you want to delete this media?')) return

        try {
            const response = await axios.delete(`${API_URL}/admin/experience-media/${mediaId}`, getAuthHeaders())
            if (response.data.success) {
                toast.success('Media deleted successfully')
                fetchExperienceMedia(selectedExperience)
            }
        } catch (error) {
            console.error('Error deleting media:', error)
            toast.error('Failed to delete media')
        }
    }

    const handleUpdateMediaOrder = async (mediaId, newOrder) => {
        try {
            const response = await axios.put(`${API_URL}/admin/experience-media/${mediaId}`, {
                media_order: newOrder,
                is_active: true
            }, getAuthHeaders())

            if (response.data.success) {
                toast.success('Media order updated')
                fetchExperienceMedia(selectedExperience)
            }
        } catch (error) {
            console.error('Error updating media order:', error)
            toast.error('Failed to update media order')
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gradiant">Experience Media Management</h1>
            </div>

            {/* Experience Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Select Experience</h2>
                <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Choose an experience...</option>
                    {experienceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {selectedExperience && (
                <>
                    {/* Upload Section */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Upload New Media</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                disabled={uploadingMedia}
                                className="hidden"
                                id="media-upload"
                            />
                            <label
                                htmlFor="media-upload"
                                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                    uploadingMedia ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {uploadingMedia ? 'Uploading...' : 'Choose Image or Video'}
                            </label>
                            <p className="mt-2 text-sm text-gray-500">
                                Supports JPG, PNG, MP4, WebM files
                            </p>
                        </div>
                    </div>

                    {/* Media Grid */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Current Media ({experienceMedia.length} items)
                        </h2>
                        
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading media...</p>
                            </div>
                        ) : experienceMedia.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No media found for this experience
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {experienceMedia.map((media, index) => (
                                    <div key={media.media_id} className="border rounded-lg overflow-hidden">
                                        <div className="aspect-video bg-gray-100 relative">
                                            {media.media_type === 'image' ? (
                                                <img
                                                    src={media.media_url.startsWith('/uploads/') ? `${API_URL.replace('/api/v1', '')}${media.media_url}` : media.media_url}
                                                    alt={`${selectedExperience} media ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={media.media_url.startsWith('/uploads/') ? `${API_URL.replace('/api/v1', '')}${media.media_url}` : media.media_url}
                                                    className="w-full h-full object-cover"
                                                    controls
                                                />
                                            )}
                                            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                                #{media.media_order}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {media.media_type === 'image' ? '📷 Image' : '🎥 Video'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Order: {media.media_order}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="flex-1 px-2 py-1 text-sm">
                                                    Order: {media.media_order}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteMedia(media.media_id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ExperienceMediaManager