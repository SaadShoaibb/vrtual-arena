'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

const PricingManagementPage = () => {
    const [sessions, setSessions] = useState([]);
    const [sessionPricing, setSessionPricing] = useState([]);
    const [groupDiscounts, setGroupDiscounts] = useState([]);
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sessions');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchSessions(),
                fetchSessionPricing(),
                fetchGroupDiscounts(),
                fetchPasses()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/get-sessions/`, getAuthHeaders());
            setSessions(response.data.sessions || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchSessionPricing = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/sessions/pricing`, getAuthHeaders());
            if (response.data.success) {
                setSessionPricing(response.data.pricing || []);
            }
        } catch (error) {
            console.error('Error fetching session pricing:', error);
        }
    };

    const fetchGroupDiscounts = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/sessions/group-discounts`, getAuthHeaders());
            if (response.data.success) {
                setGroupDiscounts(response.data.discounts || []);
            }
        } catch (error) {
            console.error('Error fetching group discounts:', error);
        }
    };

    const fetchPasses = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/passes`, getAuthHeaders());
            if (response.data.success) {
                setPasses(response.data.passes || []);
            }
        } catch (error) {
            console.error('Error fetching passes:', error);
            // Initialize default passes if none exist
            setPasses([
                { pass_id: 'new1', name: '1-Hour Pass', duration_hours: 1, price: 35, description: 'Unlimited access to all experiences for 1 hour' },
                { pass_id: 'new2', name: '2-Hour Pass', duration_hours: 2, price: 55, description: 'Unlimited access to all experiences for 2 hours' },
                { pass_id: 'new3', name: 'Half-Day Pass', duration_hours: 4, price: 85, description: 'Unlimited access to all experiences for 4 hours' },
                { pass_id: 'new4', name: 'Full-Day Pass', duration_hours: 8, price: 120, description: 'Unlimited access to all experiences for 8 hours' }
            ]);
        }
    };

    const updateSessionPricing = async (sessionId, sessionCount, price) => {
        try {
            await axios.put(
                `${API_URL}/admin/sessions/admin-pricing`,
                { session_id: sessionId, session_count: sessionCount, price },
                getAuthHeaders()
            );
            toast.success('Session pricing updated successfully');
            fetchSessionPricing();
        } catch (error) {
            console.error('Error updating session pricing:', error);
            toast.error('Failed to update session pricing');
        }
    };

    const updateGroupDiscount = async (discountId, data) => {
        try {
            await axios.put(
                `${API_URL}/admin/sessions/group-discounts/${discountId}`,
                data,
                getAuthHeaders()
            );
            toast.success('Group discount updated successfully');
            fetchGroupDiscounts();
        } catch (error) {
            console.error('Error updating group discount:', error);
            toast.error('Failed to update group discount');
        }
    };

    const createGroupDiscount = async (data) => {
        try {
            await axios.post(
                `${API_URL}/admin/sessions/group-discounts`,
                data,
                getAuthHeaders()
            );
            toast.success('Group discount created successfully');
            fetchGroupDiscounts();
        } catch (error) {
            console.error('Error creating group discount:', error);
            toast.error('Failed to create group discount');
        }
    };

    const updatePass = async (passId, data) => {
        try {
            await axios.put(
                `${API_URL}/admin/passes/${passId}`,
                data,
                getAuthHeaders()
            );
            toast.success('Pass updated successfully');
            fetchPasses();
        } catch (error) {
            console.error('Error updating pass:', error);
            toast.error('Failed to update pass');
        }
    };

    const createPass = async (data) => {
        try {
            await axios.post(
                `${API_URL}/admin/passes`,
                data,
                getAuthHeaders()
            );
            toast.success('Pass created successfully');
            fetchPasses();
        } catch (error) {
            console.error('Error creating pass:', error);
            toast.error('Failed to create pass');
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
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Pricing Management</h1>
                
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'sessions', name: 'Session Pricing' },
                            { id: 'discounts', name: 'Group Discounts' },
                            { id: 'passes', name: 'Time Passes' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Session Pricing Tab */}
                {activeTab === 'sessions' && (
                    <SessionPricingTab 
                        sessions={sessions}
                        sessionPricing={sessionPricing}
                        onUpdatePricing={updateSessionPricing}
                    />
                )}

                {/* Group Discounts Tab */}
                {activeTab === 'discounts' && (
                    <GroupDiscountsTab 
                        discounts={groupDiscounts}
                        onUpdateDiscount={updateGroupDiscount}
                        onCreateDiscount={createGroupDiscount}
                    />
                )}

                {/* Time Passes Tab */}
                {activeTab === 'passes' && (
                    <TimePassesTab 
                        passes={passes}
                        onUpdatePass={updatePass}
                        onCreatePass={createPass}
                    />
                )}
            </div>
        </div>
    );
};

// Session Pricing Component
const SessionPricingTab = ({ sessions, sessionPricing, onUpdatePricing }) => {
    const [editingPricing, setEditingPricing] = useState({});

    const getSessionPricing = (sessionId, sessionCount) => {
        const pricing = sessionPricing.find(p => p.session_id === sessionId && p.session_count === sessionCount);
        return pricing ? pricing.price : '';
    };

    const handlePricingChange = (sessionId, sessionCount, price) => {
        setEditingPricing(prev => ({
            ...prev,
            [`${sessionId}_${sessionCount}`]: price
        }));
    };

    const savePricing = (sessionId, sessionCount) => {
        const price = editingPricing[`${sessionId}_${sessionCount}`];
        if (price && !isNaN(price)) {
            onUpdatePricing(sessionId, sessionCount, parseFloat(price));
            setEditingPricing(prev => {
                const newState = { ...prev };
                delete newState[`${sessionId}_${sessionCount}`];
                return newState;
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Session Pricing Configuration</h2>
            <p className="text-gray-600 mb-6">Set individual session prices and 2-session bundle prices for each VR experience.</p>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                VR Experience
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                1 Session Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                2 Sessions Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sessions.map((session) => (
                            <tr key={session.session_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{session.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{session.duration_minutes} minutes</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={editingPricing[`${session.session_id}_1`] ?? getSessionPricing(session.session_id, 1)}
                                        onChange={(e) => handlePricingChange(session.session_id, 1, e.target.value)}
                                        onBlur={() => savePricing(session.session_id, 1)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={editingPricing[`${session.session_id}_2`] ?? getSessionPricing(session.session_id, 2)}
                                        onChange={(e) => handlePricingChange(session.session_id, 2, e.target.value)}
                                        onBlur={() => savePricing(session.session_id, 2)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => {
                                            savePricing(session.session_id, 1);
                                            savePricing(session.session_id, 2);
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Group Discounts Component
const GroupDiscountsTab = ({ discounts, onUpdateDiscount, onCreateDiscount }) => {
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [newDiscount, setNewDiscount] = useState({
        min_players: '',
        max_players: '',
        discount_percentage: '',
        discount_name: ''
    });

    const handleEdit = (discount) => {
        setEditingDiscount({ ...discount });
    };

    const handleSave = async () => {
        if (editingDiscount) {
            await onUpdateDiscount(editingDiscount.discount_id, editingDiscount);
            setEditingDiscount(null);
        }
    };

    const handleCreate = async () => {
        if (newDiscount.min_players && newDiscount.discount_percentage && newDiscount.discount_name) {
            await onCreateDiscount({
                ...newDiscount,
                max_players: newDiscount.max_players || null,
                is_active: true
            });
            setNewDiscount({
                min_players: '',
                max_players: '',
                discount_percentage: '',
                discount_name: ''
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Group Discounts Configuration</h2>
            <p className="text-gray-600 mb-6">Configure automatic discounts based on group size.</p>

            {/* Add New Discount */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Add New Discount</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="number"
                        placeholder="Min Players"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newDiscount.min_players}
                        onChange={(e) => setNewDiscount(prev => ({ ...prev, min_players: e.target.value }))}
                    />
                    <input
                        type="number"
                        placeholder="Max Players (optional)"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newDiscount.max_players}
                        onChange={(e) => setNewDiscount(prev => ({ ...prev, max_players: e.target.value }))}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Discount %"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newDiscount.discount_percentage}
                        onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Discount Name"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newDiscount.discount_name}
                        onChange={(e) => setNewDiscount(prev => ({ ...prev, discount_name: e.target.value }))}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Discount
                </button>
            </div>

            {/* Existing Discounts */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Player Range
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount %
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {discounts.map((discount) => (
                            <tr key={discount.discount_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingDiscount?.discount_id === discount.discount_id ? (
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            value={editingDiscount.discount_name}
                                            onChange={(e) => setEditingDiscount(prev => ({ ...prev, discount_name: e.target.value }))}
                                        />
                                    ) : (
                                        <div className="text-sm font-medium text-gray-900">{discount.discount_name}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingDiscount?.discount_id === discount.discount_id ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                value={editingDiscount.min_players}
                                                onChange={(e) => setEditingDiscount(prev => ({ ...prev, min_players: e.target.value }))}
                                            />
                                            <span>-</span>
                                            <input
                                                type="number"
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                value={editingDiscount.max_players || ''}
                                                onChange={(e) => setEditingDiscount(prev => ({ ...prev, max_players: e.target.value || null }))}
                                                placeholder="∞"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            {discount.min_players} - {discount.max_players || '∞'}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingDiscount?.discount_id === discount.discount_id ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                            value={editingDiscount.discount_percentage}
                                            onChange={(e) => setEditingDiscount(prev => ({ ...prev, discount_percentage: e.target.value }))}
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-500">{discount.discount_percentage}%</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        discount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {discount.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {editingDiscount?.discount_id === discount.discount_id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingDiscount(null)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(discount)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Time Passes Component
const TimePassesTab = ({ passes, onUpdatePass, onCreatePass }) => {
    const [editingPass, setEditingPass] = useState(null);
    const [newPass, setNewPass] = useState({
        name: '',
        duration_hours: '',
        price: '',
        description: ''
    });

    const handleEdit = (pass) => {
        setEditingPass({ ...pass });
    };

    const handleSave = async () => {
        if (editingPass) {
            await onUpdatePass(editingPass.pass_id, editingPass);
            setEditingPass(null);
        }
    };

    const handleCreate = async () => {
        if (newPass.name && newPass.duration_hours && newPass.price) {
            await onCreatePass({
                ...newPass,
                duration_hours: parseInt(newPass.duration_hours),
                price: parseFloat(newPass.price),
                is_active: true
            });
            setNewPass({
                name: '',
                duration_hours: '',
                price: '',
                description: ''
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Time Passes Configuration</h2>
            <p className="text-gray-600 mb-6">Configure unlimited access passes for different durations.</p>

            {/* Add New Pass */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Add New Pass</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Pass Name"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newPass.name}
                        onChange={(e) => setNewPass(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                        type="number"
                        placeholder="Duration (hours)"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newPass.duration_hours}
                        onChange={(e) => setNewPass(prev => ({ ...prev, duration_hours: e.target.value }))}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newPass.price}
                        onChange={(e) => setNewPass(prev => ({ ...prev, price: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={newPass.description}
                        onChange={(e) => setNewPass(prev => ({ ...prev, description: e.target.value }))}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Pass
                </button>
            </div>

            {/* Existing Passes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {passes.map((pass) => (
                    <div key={pass.pass_id} className="border border-gray-200 rounded-lg p-4">
                        {editingPass?.pass_id === pass.pass_id ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={editingPass.name}
                                    onChange={(e) => setEditingPass(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={editingPass.duration_hours}
                                    onChange={(e) => setEditingPass(prev => ({ ...prev, duration_hours: e.target.value }))}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={editingPass.price}
                                    onChange={(e) => setEditingPass(prev => ({ ...prev, price: e.target.value }))}
                                />
                                <textarea
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={editingPass.description}
                                    onChange={(e) => setEditingPass(prev => ({ ...prev, description: e.target.value }))}
                                    rows="2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingPass(null)}
                                        className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{pass.name}</h3>
                                <p className="text-2xl font-bold text-blue-600 my-2">${pass.price}</p>
                                <p className="text-sm text-gray-600 mb-2">{pass.duration_hours} hours</p>
                                <p className="text-xs text-gray-500 mb-3">{pass.description}</p>
                                <button
                                    onClick={() => handleEdit(pass)}
                                    className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingManagementPage;
