'use client'
import AuthModel from '@/app/components/AuthModal';
import PaymentModal from '@/app/components/PaymentForm';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { translations } from '@/app/translations';
import { formatDisplayPrice } from '@/app/utils/currency';

const Checkout = ({ cart, locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const [cartItems, setCartItems] = useState(cart || []);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        shippingMethod: 'standard',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const {userData} = useSelector((state)=>state.userData)
    const [shippingPrice, setShippingPrice] = useState(5.0); // Default shipping price
    const [userAddress, setUserAddress] = useState(null); // Existing user address
    const router = useRouter();
    const [paymentModel, setPaymentModel] = useState(false)
    const [orderId, setOrderId] = useState(null)
    useEffect(() => {
        setCartItems(cart);
        fetchUserAddress();

        // Check if cart has tournaments or events
        const hasDigitalItems = cart.length > 0 && cart.some(item =>
            item.item_type === 'tournament' || item.item_type === 'event'
        );

        // Set shipping price to 0 if cart has tournament or event items
        const onlyDigitalItems = cart.length > 0 && cart.every(item =>
            item.item_type === 'tournament' || item.item_type === 'event'
        );

        if (onlyDigitalItems) {
            setShippingPrice(0);
            setPaymentMethod('online'); // Force online payment for digital items
        } else {
            setShippingPrice(shippingInfo.shippingMethod === 'express' ? 10.0 : 5.0);
        }
    }, [cart]);

    const fetchUserAddress = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/address`, getAuthHeaders());
            if (response.data.success && response.data.addresses.length > 0) {
                const address = response.data.addresses[0]; // Use the first address
                setShippingInfo({
                    name: address.full_name,
                    address: address.address,
                    city: address.city,
                    state: address.state,
                    zip: address.zip_code,
                    country: address.country,
                    shippingMethod: 'standard',
                });
                setUserAddress(address);
            }
        } catch (err) {
            console.error('Error fetching user address:', err);
        }
    };

    // Check if cart has any physical products
    const hasPhysicalProducts = cartItems.some(item => !item.item_type || item.item_type === 'product');
    
    const subtotal = cartItems.reduce((total, item) => total + item.discount_price * item.quantity, 0);
    const total = subtotal + shippingPrice;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePaymentDetailsChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails({ ...paymentDetails, [name]: value });
    };

    const handleShippingMethodChange = (e) => {
        const method = e.target.value;
        setShippingInfo({ ...shippingInfo, shippingMethod: method });
        // Only charge shipping if there are physical products
        if (hasPhysicalProducts) {
            setShippingPrice(method === 'express' ? 10.0 : 5.0);
        } else {
            setShippingPrice(0);
        }
    };

    const handleConfirmOrder = async () => {
        // Validate required fields
        const requiredFields = ['name', 'address', 'city', 'state', 'zip', 'country'];
        const missingFields = [];
        
        // Check if all required fields are filled
        requiredFields.forEach(field => {
            if (!shippingInfo[field] || shippingInfo[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        // If there are missing fields, show an alert and return
        if (missingFields.length > 0) {
            alert(`${t.pleaseFillRequiredFields} ${missingFields.join(', ')}`);
            return;
        }

        // If cart is empty, show an alert and return
        if (cartItems.length === 0) {
            alert(t.cartIsEmpty);
            return;
        }

        const orderDetails = {
            cartItems,
            shippingInfo,
            subtotal,
            shippingPrice,
            total,
            paymentMethod,
            paymentDetails,
        };

        console.log('Order Details:', orderDetails);
        if(paymentMethod === "cod"){
            try {
                // Prepare the request payload for the merged controller
                const payload = {
                    total_amount: total,
                    status: 'pending',
                    shipping_cost: shippingPrice,
                    payment_method: paymentMethod,
                    payment_status:"pending",
                    items: cartItems.map((item) => {
                        if (item.item_type === 'tournament') {
                            return {
                                tournament_id: item.tournament_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'tournament'
                            };
                        } else if (item.item_type === 'event') {
                            return {
                                event_id: item.event_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'event'
                            };
                        } else {
                            return {
                                product_id: item.product_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'product'
                            };
                        }
                    }),
                    shipping_address: {
                        full_name: shippingInfo.name,
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        zip_code: shippingInfo.zip,
                        country: shippingInfo.country,
                    },
                };

                // Call the merged controller endpoint
                const response = await axios.post(
                    `${API_URL}/user/create-order`,
                    payload,
                    getAuthHeaders()
                );

                if (response.data.success) {
                    alert(t.orderPlacedSuccessfully);
                    // Delete each cart item in the order
                    for (const item of cartItems) {
                        await axios.delete(
                            `${API_URL}/user/cart/${item.cart_id}`,
                            getAuthHeaders()
                        );
                        console.log(`Cart item ${item.cart_id} deleted successfully.`);
                    }
                    router.push(`/orders?locale=${locale}`);
                } else {
                    alert(t.failedToPlaceOrder);
                }
            } catch (err) {
                console.error('Error placing order:', err);
                alert(t.failedToPlaceOrder);
            }
        } else {
            // For online payment, create order first then redirect to payment
            try {
                // Create order with pending status
                const payload = {
                    total_amount: total,
                    status: 'pending',
                    payment_status: 'pending',
                    shipping_cost: shippingPrice,
                    payment_method: 'online',
                    items: cartItems.map((item) => {
                        if (item.item_type === 'tournament') {
                            return {
                                tournament_id: item.tournament_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'tournament'
                            };
                        } else if (item.item_type === 'event') {
                            return {
                                event_id: item.event_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'event'
                            };
                        } else {
                            return {
                                product_id: item.product_id,
                                quantity: item.quantity,
                                price: item.discount_price,
                                item_type: 'product'
                            };
                        }
                    }),
                    shipping_address: {
                        full_name: shippingInfo.name,
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        zip_code: shippingInfo.zip,
                        country: shippingInfo.country,
                    },
                };

                const response = await axios.post(
                    `${API_URL}/user/create-order`,
                    payload,
                    getAuthHeaders()
                );

                if (response.data.success) {
                    // Store order ID for payment
                    setOrderId(response.data.order_id);
                    setPaymentModel(true);
                } else {
                    alert(t.failedToPlaceOrder);
                }
            } catch (err) {
                console.error('Error creating order:', err);
                alert(t.failedToPlaceOrder);
            }
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            // Payment was successful, cart will be cleared by webhook
            // Just redirect to success page or orders page
            alert('Payment successful! Your order has been placed.');
            setPaymentModel(false);
            router.push(`/orders?locale=${locale}`);
        } catch (err) {
            console.error('Error after payment success:', err);
            setPaymentModel(false);
        }
    }
    return (
        <div className='bg-blackish text-white'>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-wrap-balance">{t.checkout}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-wrap-balance">{t.paymentMethod}</h2>
                        <div className="mb-6">
                            {/* Only show COD if cart doesn't have tournaments or events */}
                            {!cartItems.some(item => item.item_type === 'tournament' || item.item_type === 'event') && (
                                <label className="block mb-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={handlePaymentMethodChange}
                                        className="mr-2"
                                    />
                                    {t.cashOnDelivery}
                                </label>
                            )}
                            <label className="block mb-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={handlePaymentMethodChange}
                                    className="mr-2"
                                />
                                {t.onlinePayment}
                            </label>
                            {/* Show notice for digital items */}
                            {cartItems.some(item => item.item_type === 'tournament' || item.item_type === 'event') && (
                                <p className="text-sm text-yellow-400 mt-2">
                                    {t.digitalItemsOnlineOnly || 'Tournament and event registrations require online payment.'}
                                </p>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-4 text-wrap-balance">{hasPhysicalProducts ? t.shippingInformation : t.contactInformation}</h2>
                        <form className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder={t.fullName}
                                required
                                value={shippingInfo.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder={t.address}
                                value={shippingInfo.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder={t.city}
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder={t.state}
                                value={shippingInfo.state}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="zip"
                                placeholder={t.zipCode}
                                value={shippingInfo.zip}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder={t.country}
                                value={shippingInfo.country}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            {hasPhysicalProducts && (
                                <div>
                                    <label className="block mb-2">{t.shippingMethod}</label>
                                    <select
                                        name="shippingMethod"
                                        value={shippingInfo.shippingMethod}
                                        onChange={handleShippingMethodChange}
                                        className="w-full p-2 border border-gray-300 rounded bg-transparent"
                                    >
                                        <option value="standard">{t.standardShipping}</option>
                                        <option value="express">{t.expressShipping}</option>
                                    </select>
                                </div>
                            )}
                        </form>

                      
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-wrap-balance">{t.orderSummary}</h2>
                        <div className="bg-gray-900 p-4 rounded">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left p-2">Item</th>
                                        <th className="text-center p-2">Quantity</th>
                                        <th className="text-right p-2">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.cart_id} className="border-b">
                                            <td className="p-2">
                                                {item.name}
                                                {item.item_type === 'tournament' && 
                                                    <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded">Tournament</span>
                                                }
                                            </td>
                                            <td className="text-center p-2">{item.quantity}</td>
                                            <td className="text-right p-2">${item.discount_price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <div className="flex justify-between p-2">
                                    <span>{t.subtotal}</span>
                                    <span>{formatDisplayPrice(subtotal, locale)}</span>
                                </div>
                                {hasPhysicalProducts && (
                                    <div className="flex justify-between p-2">
                                        <span>{t.shipping}</span>
                                        <span>{formatDisplayPrice(shippingPrice, locale)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between p-2 font-bold">
                                    <span>{t.total}</span>
                                    <span>{formatDisplayPrice(total, locale)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmOrder}
                                className="w-full bg-grad py-2 text-white mt-4 font-bold transition-colors duration-500"
                            >
                                {t.confirmOrder}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            {paymentModel &&
                    <>
                        <AuthModel onClose={() => setPaymentModel(false)}>


                            <PaymentModal
                                isOpen={paymentModel}
                                onClose={() => setPaymentModel(false)}
                                entity={orderId}
                                userId={userData?.user_id}
                                amount={total}
                                onSuccess={handlePaymentSuccess}
                                onRedeemSuccess={handlePaymentSuccess}
                                type="order"
                            />


                        </AuthModel>
                    </>
                }
        </div>
    );
};

export default Checkout;