'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

const SessionPricingPage = () => {
    const [sessions, setSessions] = useState([]);
    const [pricing, setPricing] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pricing');

    // Fetch data
    useEffect(() => {
        fetchSessions();
        fetchPricing();
        fetchTimeSlots();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/admin/sessions/enhanced`, getAuthHeaders());
            if (response.data.success) {
                setSessions(response.data.sessions);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to fetch sessions');
        }
    };

    const fetchPricing = async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/admin/sessions/pricing`, getAuthHeaders());
            if (response.data.success) {
                setPricing(response.data.pricing);
            }
        } catch (error) {
            console.error('Error fetching pricing:', error);
            toast.error('Failed to fetch pricing');
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/admin/sessions/time-slots`, getAuthHeaders());
            if (response.data.success) {
                setTimeSlots(response.data.timeSlots);
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
            toast.error('Failed to fetch time slots');
        } finally {
            setLoading(false);
        }
    };

    const updatePricing = async (sessionId, sessionCount, price, isActive) => {
        try {
            const response = await axios.put(
                `${API_URL}/v1/admin/sessions/pricing/${sessionId}`,
                { sessionCount, price, isActive },
                getAuthHeaders()
            );
            
            if (response.data.success) {
                toast.success('Pricing updated successfully');
                fetchPricing();
            }
        } catch (error) {
            console.error('Error updating pricing:', error);
            toast.error('Failed to update pricing');
        }
    };

    const updateTimeSlot = async (slotId, startHour, endHour, isActive) => {
        try {
            const response = await axios.put(
                `${API_URL}/v1/admin/sessions/time-slots/${slotId}`,
                { startHour, endHour, isActive },
                getAuthHeaders()
            );
            
            if (response.data.success) {
                toast.success('Time slot updated successfully');
                fetchTimeSlots();
            }
        } catch (error) {
            console.error('Error updating time slot:', error);
            toast.error('Failed to update time slot');
        }
    };

    const createTimeSlot = async (startHour, endHour) => {
        try {
            const response = await axios.post(
                `${API_URL}/v1/admin/sessions/time-slots`,
                { startHour, endHour, isActive: true },
                getAuthHeaders()
            );
            
            if (response.data.success) {
                toast.success('Time slot created successfully');
                fetchTimeSlots();
            }
        } catch (error) {
            console.error('Error creating time slot:', error);
            toast.error('Failed to create time slot');
        }
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
            <h1 className="text-3xl font-bold mb-6">Session Pricing & Time Management</h1>
            
            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('pricing')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'pricing'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Session Pricing
                        </button>
                        <button
                            onClick={() => setActiveTab('timeslots')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'timeslots'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Time Slots
                        </button>
                        <button
                            onClick={() => setActiveTab('sessions')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'sessions'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Session Management
                        </button>
                    </nav>
                </div>
            </div>

            {/* Session Pricing Tab */}
            {activeTab === 'pricing' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Session Pricing Management</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Session Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Session Count
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price ($)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Active
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sessions.map(session => (
                                    [1, 2].map(sessionCount => {
                                        const existingPricing = pricing.find(p => 
                                            p.session_id === session.session_id && p.session_count === sessionCount
                                        );
                                        
                                        return (
                                            <PricingRow
                                                key={`${session.session_id}-${sessionCount}`}
                                                session={session}
                                                sessionCount={sessionCount}
                                                existingPricing={existingPricing}
                                                onUpdate={updatePricing}
                                            />
                                        );
                                    })
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Time Slots Tab */}
            {activeTab === 'timeslots' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Time Slots Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {timeSlots.map(slot => (
                            <TimeSlotCard
                                key={slot.slot_id}
                                slot={slot}
                                onUpdate={updateTimeSlot}
                            />
                        ))}
                        <AddTimeSlotCard onCreate={createTimeSlot} />
                    </div>
                </div>
            )}

            {/* Session Management Tab */}
            {activeTab === 'sessions' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Enhanced Session Management</h2>
                    <div className="space-y-6">
                        {sessions.map(session => (
                            <SessionManagementCard
                                key={session.session_id}
                                session={session}
                                onUpdate={fetchSessions}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Pricing Row Component
const PricingRow = ({ session, sessionCount, existingPricing, onUpdate }) => {
    const [price, setPrice] = useState(existingPricing?.price || '');
    const [isActive, setIsActive] = useState(existingPricing?.is_active || false);

    const handleSave = () => {
        if (!price) {
            toast.error('Please enter a price');
            return;
        }
        onUpdate(session.session_id, sessionCount, parseFloat(price), isActive);
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {session.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sessionCount} session{sessionCount > 1 ? 's' : ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="0.00"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                    onClick={handleSave}
                    className="text-blue-600 hover:text-blue-900"
                >
                    Save
                </button>
            </td>
        </tr>
    );
};

// Time Slot Card Component
const TimeSlotCard = ({ slot, onUpdate }) => {
    const [startHour, setStartHour] = useState(slot.start_hour);
    const [endHour, setEndHour] = useState(slot.end_hour);
    const [isActive, setIsActive] = useState(slot.is_active);

    const handleSave = () => {
        onUpdate(slot.slot_id, startHour, endHour, isActive);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Hour</label>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={startHour}
                        onChange={(e) => setStartHour(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Hour</label>
                    <input
                        type="number"
                        min="1"
                        max="24"
                        value={endHour}
                        onChange={(e) => setEndHour(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

// Add Time Slot Card Component
const AddTimeSlotCard = ({ onCreate }) => {
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(10);

    const handleCreate = () => {
        onCreate(startHour, endHour);
        setStartHour(9);
        setEndHour(10);
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Add New Time Slot</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Hour</label>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={startHour}
                        onChange={(e) => setStartHour(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Hour</label>
                    <input
                        type="number"
                        min="1"
                        max="24"
                        value={endHour}
                        onChange={(e) => setEndHour(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

// Session Management Card Component
const SessionManagementCard = ({ session, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: session.name || '',
        description: session.description || '',
        duration_hours: session.duration_hours || 0.5,
        min_duration_hours: session.min_duration_hours || 0.5,
        max_duration_hours: session.max_duration_hours || 4.0,
        hourly_rate: session.hourly_rate || 0,
        setup_time_minutes: session.setup_time_minutes || 5,
        cleanup_time_minutes: session.cleanup_time_minutes || 5,
        max_players: session.max_players || 1,
        is_active: session.is_active || true
    });

    const handleSave = async () => {
        try {
            await axios.put(
                `${API_URL}/v1/admin/sessions/enhanced/${session.session_id}`,
                formData,
                getAuthHeaders()
            );
            toast.success('Session updated successfully');
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Error updating session:', error);
            toast.error('Failed to update session');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: session.name || '',
            description: session.description || '',
            duration_hours: session.duration_hours || 0.5,
            min_duration_hours: session.min_duration_hours || 0.5,
            max_duration_hours: session.max_duration_hours || 4.0,
            hourly_rate: session.hourly_rate || 0,
            setup_time_minutes: session.setup_time_minutes || 5,
            cleanup_time_minutes: session.cleanup_time_minutes || 5,
            max_players: session.max_players || 1,
            is_active: session.is_active || true
        });
        setIsEditing(false);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="text-lg font-semibold border border-gray-300 rounded px-2 py-1"
                        />
                    ) : (
                        session.name
                    )}
                </h3>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    {isEditing ? (
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            rows="3"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.description}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration (hours)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            value={formData.duration_hours}
                            onChange={(e) => setFormData({...formData, duration_hours: parseFloat(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.duration_hours} hours</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Duration (hours)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            value={formData.min_duration_hours}
                            onChange={(e) => setFormData({...formData, min_duration_hours: parseFloat(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.min_duration_hours} hours</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration (hours)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            value={formData.max_duration_hours}
                            onChange={(e) => setFormData({...formData, max_duration_hours: parseFloat(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.max_duration_hours} hours</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.hourly_rate}
                            onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">${session.hourly_rate}/hour</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
                    {isEditing ? (
                        <input
                            type="number"
                            min="1"
                            value={formData.max_players}
                            onChange={(e) => setFormData({...formData, max_players: parseInt(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.max_players} players</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Time (minutes)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            min="0"
                            value={formData.setup_time_minutes}
                            onChange={(e) => setFormData({...formData, setup_time_minutes: parseInt(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.setup_time_minutes} minutes</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cleanup Time (minutes)</label>
                    {isEditing ? (
                        <input
                            type="number"
                            min="0"
                            value={formData.cleanup_time_minutes}
                            onChange={(e) => setFormData({...formData, cleanup_time_minutes: parseInt(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-600">{session.cleanup_time_minutes} minutes</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                        <select
                            value={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    ) : (
                        <p className={`text-sm ${session.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {session.is_active ? 'Active' : 'Inactive'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPricingPage;
