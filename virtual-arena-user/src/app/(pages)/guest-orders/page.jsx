"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '@/utils/ApiUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getGuestCartImageUrl } from '@/app/utils/imageUtils';

const GuestOrdersPage = () => {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Pre-fill email from URL parameters
    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
            // Auto-search if email is provided
            handleSearchWithEmail(emailParam);
        }
    }, [searchParams]);

    const handleSearchWithEmail = async (emailToSearch) => {
        if (!emailToSearch) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/user/guest-orders?email=${encodeURIComponent(emailToSearch)}`);

            if (response.data.success) {
                setOrders(response.data.orders);
                setSearched(true);

                if (response.data.orders.length === 0) {
                    toast.info('No orders found for this email address');
                } else {
                    toast.success(`Found ${response.data.orders.length} order(s)`);
                }
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching guest orders:', error);
            toast.error('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await handleSearchWithEmail(email);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cod':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentMethodDisplay = (method) => {
        return method === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Track Your Orders</h1>
                        <p className="text-gray-300">Enter your email address to view your order history</p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-gray-800 rounded-lg p-6 mb-8">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address..."
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search Orders'}
                            </button>
                        </form>
                    </div>

                    {/* Orders List */}
                    {searched && (
                        <div className="space-y-6">
                            {orders.length === 0 ? (
                                <div className="bg-gray-800 rounded-lg p-8 text-center">
                                    <div className="text-gray-400 text-lg mb-2">📦</div>
                                    <h3 className="text-white text-xl font-semibold mb-2">No Orders Found</h3>
                                    <p className="text-gray-400">No orders were found for this email address.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.order_id} className="bg-gray-800 rounded-lg p-6">
                                        {/* Order Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-white text-lg font-semibold">
                                                    Order #{order.order_reference || order.order_id}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.payment_status)}`}>
                                                    {order.payment_status === 'paid' ? 'Paid' : 
                                                     order.payment_status === 'cod' ? 'COD' : 
                                                     order.payment_status === 'pending' ? 'Pending' : 
                                                     order.payment_status}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Customer</p>
                                                <p className="text-white">{order.guest_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Payment Method</p>
                                                <p className="text-white">{getPaymentMethodDisplay(order.payment_method || 'online')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Amount</p>
                                                <p className="text-white font-semibold">${parseFloat(order.total_amount).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Shipping Cost</p>
                                                <p className="text-white">${parseFloat(order.shipping_cost || 0).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        {order.shipping_address && (
                                            <div className="mb-4">
                                                <p className="text-gray-400 text-sm mb-1">Shipping Address</p>
                                                <p className="text-white">{order.shipping_address}</p>
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        {order.items && order.items.length > 0 && (
                                            <div>
                                                <p className="text-gray-400 text-sm mb-3">Items ({order.items.length})</p>
                                                <div className="space-y-3">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                                                            <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden">
                                                                {item.product_image && (
                                                                    <img
                                                                        src={getGuestCartImageUrl(item.product_image)}
                                                                        alt={item.product_name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-white font-medium">{item.product_name}</h4>
                                                                <p className="text-gray-400 text-sm">
                                                                    Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="text-white font-semibold">
                                                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestOrdersPage;
