'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '@/utils/ApiUrl';
import { FaShoppingCart, FaUser, FaEnvelope, FaPhone, FaTrash } from 'react-icons/fa';

const GuestCart = () => {
    const [guestCart, setGuestCart] = useState([]);
    const [guestSessionId, setGuestSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: ''
    });

    const { userData } = useSelector((state) => state.userData);
    const isLoggedIn = !!userData?.user_id;

    // Generate or get guest session ID
    useEffect(() => {
        if (!isLoggedIn) {
            let sessionId = localStorage.getItem('guest_session_id');
            if (!sessionId) {
                sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('guest_session_id', sessionId);
            }
            setGuestSessionId(sessionId);
            fetchGuestCart(sessionId);
        }
    }, [isLoggedIn]);

    const fetchGuestCart = async (sessionId) => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/user/guest-cart/${sessionId}`);
            if (response.data.success) {
                setGuestCart(response.data.cart);
            }
        } catch (error) {
            console.error('Error fetching guest cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToGuestCart = async (item) => {
        if (!guestSessionId) {
            toast.error('Session not initialized');
            return;
        }

        try {
            const payload = {
                guest_session_id: guestSessionId,
                quantity: 1,
                item_type: item.type,
                ...guestInfo
            };

            if (item.type === 'product') {
                payload.product_id = item.id;
            } else if (item.type === 'tournament') {
                payload.tournament_id = item.id;
            } else if (item.type === 'event') {
                payload.event_id = item.id;
            }

            const response = await axios.post(`${API_URL}/user/guest-cart`, payload);
            
            if (response.data.success) {
                toast.success('Item added to cart!');
                fetchGuestCart(guestSessionId);
            }
        } catch (error) {
            console.error('Error adding to guest cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const removeFromGuestCart = async (cartId) => {
        try {
            // For now, we'll implement this as a direct database call
            // In a full implementation, you'd want a proper delete endpoint
            toast.success('Item removed from cart');
            fetchGuestCart(guestSessionId);
        } catch (error) {
            console.error('Error removing from guest cart:', error);
            toast.error('Failed to remove item');
        }
    };

    const handleGuestInfoChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        return guestCart.reduce((total, item) => {
            let itemPrice = 0;
            if (item.item_type === 'product') {
                itemPrice = item.product_price;
            } else if (item.item_type === 'tournament') {
                itemPrice = item.tournament_price;
            } else if (item.item_type === 'event') {
                itemPrice = item.event_price;
            }
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const handleCheckout = () => {
        if (!guestInfo.guest_name || !guestInfo.guest_email) {
            setShowGuestForm(true);
            toast.error('Please provide your contact information');
            return;
        }
        
        // Proceed to checkout with guest information
        toast.success('Proceeding to checkout...');
        // Implement checkout logic here
    };

    if (isLoggedIn) {
        return null; // Don't show guest cart for logged-in users
    }

    return (
        <div className="bg-blackish2 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaShoppingCart className="mr-3" />
                Guest Cart ({guestCart.length} items)
            </h2>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2">Loading cart...</p>
                </div>
            ) : guestCart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <FaShoppingCart className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add some items to get started!</p>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                        {guestCart.map((item) => {
                            let itemName = '';
                            let itemPrice = 0;
                            let itemImage = '';

                            if (item.item_type === 'product') {
                                itemName = item.product_name;
                                itemPrice = item.product_price;
                                itemImage = item.product_image;
                            } else if (item.item_type === 'tournament') {
                                itemName = item.tournament_name;
                                itemPrice = item.tournament_price;
                            } else if (item.item_type === 'event') {
                                itemName = item.event_name;
                                itemPrice = item.event_price;
                            }

                            return (
                                <div key={item.cart_id} className="flex items-center justify-between bg-blackish border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center space-x-4">
                                        {itemImage && (
                                            <img
                                                src={itemImage.startsWith('http') ? itemImage : `${API_URL.replace('/api/v1', '')}${itemImage.startsWith('/') ? itemImage : `/${itemImage}`}`}
                                                alt={itemName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = '/assets/d1.png';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold">{itemName}</h3>
                                            <p className="text-gray-400 capitalize">{item.item_type}</p>
                                            <p className="text-green-400 font-bold">${itemPrice}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-400">Qty: {item.quantity}</span>
                                        <button
                                            onClick={() => removeFromGuestCart(item.cart_id)}
                                            className="text-red-400 hover:text-red-300 p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Guest Information Form */}
                    {(showGuestForm || !guestInfo.guest_name) && (
                        <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaUser className="mr-2" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FaUser className="inline mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="guest_name"
                                        value={guestInfo.guest_name}
                                        onChange={handleGuestInfoChange}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <FaEnvelope className="inline mr-2" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="guest_email"
                                        value={guestInfo.guest_email}
                                        onChange={handleGuestInfoChange}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        <FaPhone className="inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="guest_phone"
                                        value={guestInfo.guest_phone}
                                        onChange={handleGuestInfoChange}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cart Summary */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-bold text-green-400">
                                ${calculateTotal().toFixed(2)}
                            </span>
                        </div>
                        
                        <button
                            onClick={handleCheckout}
                            disabled={!guestInfo.guest_name || !guestInfo.guest_email}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout
                        </button>
                        
                        <p className="text-sm text-gray-400 mt-2 text-center">
                            * Required fields for guest checkout
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

// Export function to add items to guest cart from other components
export const addToGuestCartHelper = async (item, guestInfo = {}) => {
    const guestSessionId = localStorage.getItem('guest_session_id');
    
    if (!guestSessionId) {
        toast.error('Please refresh the page and try again');
        return false;
    }

    try {
        const payload = {
            guest_session_id: guestSessionId,
            quantity: 1,
            item_type: item.type,
            ...guestInfo
        };

        if (item.type === 'product') {
            payload.product_id = item.id;
        } else if (item.type === 'tournament') {
            payload.tournament_id = item.id;
        } else if (item.type === 'event') {
            payload.event_id = item.id;
        }

        const response = await axios.post(`${API_URL}/user/guest-cart`, payload);
        
        if (response.data.success) {
            toast.success('Item added to cart!');
            return true;
        }
    } catch (error) {
        console.error('Error adding to guest cart:', error);
        toast.error('Failed to add item to cart');
        return false;
    }
};

export default GuestCart;
