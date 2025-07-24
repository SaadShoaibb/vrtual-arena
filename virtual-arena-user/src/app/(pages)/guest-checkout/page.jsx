'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_URL, getMediaBaseUrl, getPaymentApiUrl } from '@/utils/ApiUrl';
import { getGuestCartImageUrl } from '@/app/utils/imageUtils';
import axios from 'axios';

const GuestCheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [guestData, setGuestData] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        shipping_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [shippingCost, setShippingCost] = useState(5.00);
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
    const router = useRouter();

    useEffect(() => {
        // Load cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        if (guestCart.length === 0) {
            toast.error('Your cart is empty');
            router.push('/merchandise');
            return;
        }
        setCartItems(guestCart);
    }, [router]);

    const getItemPrice = (item) => {
        if (item.discount > 0 && item.discount_price) {
            return parseFloat(item.discount_price);
        }
        return parseFloat(item.original_price || item.price || 0);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (getItemPrice(item) * item.quantity);
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + shippingCost;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        
        if (!guestData.guest_name || !guestData.guest_email || !guestData.shipping_address || !guestData.city || !guestData.state || !guestData.zip_code || !guestData.country) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        
        try {
            const orderData = {
                guest_name: guestData.guest_name,
                guest_email: guestData.guest_email,
                guest_phone: guestData.guest_phone,
                shipping_address: `${guestData.shipping_address}, ${guestData.city}, ${guestData.state} ${guestData.zip_code}, ${guestData.country}`.trim(),
                shipping_cost: shippingCost,
                payment_method: paymentMethod,
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: getItemPrice(item)
                })),
                total_amount: calculateTotal(),
                is_guest_order: true
            };

            console.log('Creating guest order:', orderData);

            // Create guest order
            const orderResponse = await axios.post(`${API_URL}/user/guest-order`, orderData);
            const order = orderResponse.data.order;

            if (paymentMethod === 'cod') {
                // For COD, just show success message and clear cart
                localStorage.removeItem('guestCart');
                window.dispatchEvent(new Event('guestCartUpdated'));

                toast.success(`Order placed successfully! Order Reference: ${order.order_reference || order.order_id}. You can track your order using your email address.`);

                // Redirect to guest orders page with email pre-filled
                setTimeout(() => {
                    router.push(`/guest-orders?email=${encodeURIComponent(guestData.guest_email)}`);
                }, 2000);
            } else {
                // For online payment, create Stripe checkout session
                console.log('Creating checkout session for guest order...');
                const checkoutPayload = {
                    user_id: 0, // Guest user
                    amount: calculateTotal(),
                    entity_type: 'order',
                    entity_id: order.order_id,
                    guest_info: {
                        name: guestData.guest_name,
                        email: guestData.guest_email,
                        phone: guestData.guest_phone
                    }
                };

                // Use the utility function to get the correct payment API URL
                const paymentUrl = getPaymentApiUrl();
                const checkoutUrl = `${paymentUrl}/create-checkout-session`;

                console.log('API_URL:', API_URL);
                console.log('Payment URL:', paymentUrl);
                console.log('Checkout URL:', checkoutUrl);
                console.log('Checkout payload:', checkoutPayload);

                const checkoutResponse = await axios.post(checkoutUrl, checkoutPayload);

                console.log('Checkout response:', checkoutResponse.data);

                if (checkoutResponse.data.success && checkoutResponse.data.url) {
                    // Clear cart before redirecting
                    localStorage.removeItem('guestCart');

                    // Trigger cart update event
                    window.dispatchEvent(new Event('guestCartUpdated'));

                    // Redirect to Stripe checkout
                    console.log('Redirecting to Stripe checkout:', checkoutResponse.data.url);
                    window.location.href = checkoutResponse.data.url;
                } else {
                    console.error('Invalid checkout response:', checkoutResponse.data);
                    throw new Error('Failed to create checkout session - no redirect URL provided');
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to process checkout. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-blackish flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blackish py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-white text-3xl font-bold mb-8 text-center">Guest Checkout</h1>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-white text-xl font-bold mb-4">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.product_id} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                                    <img
                                        src={getGuestCartImageUrl(item)}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => {
                                            e.target.src = '/assets/d1.png';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium text-sm">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {item.discount > 0 && (
                                                <span className="text-xs bg-green-600 text-white px-1 rounded">
                                                    -{Math.round(item.discount)}%
                                                </span>
                                            )}
                                            {item.discount > 0 ? (
                                                <>
                                                    <span className="text-gray-400 text-xs line-through">
                                                        ${parseFloat(item.original_price || 0).toFixed(2)}
                                                    </span>
                                                    <span className="text-white font-bold text-sm">
                                                        ${getItemPrice(item).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-white font-bold text-sm">
                                                    ${getItemPrice(item).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-white">
                                        <span className="text-sm">Qty: {item.quantity}</span>
                                        <div className="font-bold">
                                            ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-600 pt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-white">Subtotal:</span>
                                <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white">Shipping:</span>
                                <span className="text-white">${shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-600 pt-2">
                                <span className="text-white font-bold text-lg">Total:</span>
                                <span className="text-white font-bold text-xl">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Guest Information Form */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-white text-xl font-bold mb-4">Your Information</h2>
                        
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="guest_name"
                                    value={guestData.guest_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="guest_email"
                                    value={guestData.guest_email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="guest_phone"
                                    value={guestData.guest_phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="shipping_address"
                                    value={guestData.shipping_address}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter your street address..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={guestData.city}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        State/Province *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={guestData.state}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="State/Province"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        ZIP/Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={guestData.zip_code}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="ZIP/Postal Code"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={guestData.country}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="Country"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Payment Method *
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="online"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="online" className="ml-2 text-white text-sm">
                                            💳 Online Payment (Credit/Debit Card)
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="cod" className="ml-2 text-white text-sm">
                                            💵 Cash on Delivery (COD)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/merchandise')}
                                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Back to Shop
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : 'Pay Now')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestCheckoutPage;
