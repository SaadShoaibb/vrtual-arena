'use client'
import AuthModel from '@/app/components/AuthModal';
import PaymentModal from '@/app/components/PaymentForm';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Checkout = ({ cart }) => {
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
    useEffect(() => {
        setCartItems(cart);
        fetchUserAddress();
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
        setShippingPrice(method === 'express' ? 10.0 : 5.0);
    };

    const handleConfirmOrder = async () => {
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
                items: cartItems.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.discount_price,
                })),
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
                alert('Order placed successfully!');
                // Delete each cart item in the order
                for (const item of cartItems) {
                    await axios.delete(
                        `${API_URL}/user/cart/${item.cart_id}`,
                        getAuthHeaders()
                    );
                    console.log(`Cart item ${item.cart_id} deleted successfully.`);
                }
                router.push('/orders');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
        }
    }else{
        setPaymentModel(true)
    }

    };

    const handlePaymentSuccess = async () => {
        try {
            // Prepare the request payload for the merged controller
            const payload = {
                total_amount: total,
                status: 'pending',
                payment_status:"completed",
                shipping_cost: shippingPrice,
                payment_method: paymentMethod,
                items: cartItems.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.discount_price,
                })),
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
                alert('Order placed successfully!');
                // Delete each cart item in the order
                for (const item of cartItems) {
                    await axios.delete(
                        `${API_URL}/user/cart/${item.cart_id}`,
                        getAuthHeaders()
                    );
                    console.log(`Cart item ${item.cart_id} deleted successfully.`);
                }
                router.push('/orders');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setPaymentModel(false); // Close the payment modal
        }
    }
    return (
        <div className='bg-blackish text-white'>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                        <div className="mb-6">
                            <label className="block mb-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={handlePaymentMethodChange}
                                    className="mr-2"
                                />
                                Cash on Delivery (COD)
                            </label>
                            <label className="block mb-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={handlePaymentMethodChange}
                                    className="mr-2"
                                />
                                Online Payment
                            </label>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                        <form className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={shippingInfo.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={shippingInfo.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={shippingInfo.state}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="zip"
                                placeholder="ZIP Code"
                                value={shippingInfo.zip}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={shippingInfo.country}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded bg-transparent"
                            />
                            <div>
                                <label className="block mb-2">Shipping Method</label>
                                <select
                                    name="shippingMethod"
                                    value={shippingInfo.shippingMethod}
                                    onChange={handleShippingMethodChange}
                                    className="w-full p-2 border border-gray-300 rounded bg-transparent"
                                >
                                    <option value="standard">Standard Shipping ($5.00)</option>
                                    <option value="express">Express Shipping ($10.00)</option>
                                </select>
                            </div>
                        </form>

                      
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="bg-gray-900 p-4 rounded">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left p-2">Product</th>
                                        <th className="text-center p-2">Quantity</th>
                                        <th className="text-right p-2">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.cart_id} className="border-b">
                                            <td className="p-2">{item.name}</td>
                                            <td className="text-center p-2">{item.quantity}</td>
                                            <td className="text-right p-2">${item.discount_price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <div className="flex justify-between p-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between p-2">
                                    <span>Shipping</span>
                                    <span>${shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between p-2 font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleConfirmOrder}
                                className="w-full bg-grad py-2 text-white mt-4 font-bold transition-colors duration-500"
                            >
                                Confirm Order
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
                                entity={1}
                                userId={userData?.user_id}
                                amount={total} // Assuming the tournament has a ticket_price field
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