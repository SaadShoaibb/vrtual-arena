'use client';
import { closeSidebar } from '@/Store/ReduxSlice/cartSideBarSlice';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { getCartItemImageUrl, getGuestCartImageUrl } from '@/app/utils/imageUtils';
import { getMediaBaseUrl } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const UnifiedCartSidebar = ({ isOpen, cart }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.userData);
    const [cartItems, setCartItems] = useState(cart || []);
    const [guestCartItems, setGuestCartItems] = useState([]);
    const router = useRouter();

    // Load cart items based on authentication status
    useEffect(() => {
        if (isAuthenticated) {
            setCartItems(cart || []);
        } else {
            // Load guest cart from localStorage
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            setGuestCartItems(guestCart);
        }
    }, [cart, isAuthenticated]);

    // Listen for guest cart updates
    useEffect(() => {
        if (!isAuthenticated) {
            const handleGuestCartUpdate = () => {
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                setGuestCartItems(guestCart);
            };
            
            window.addEventListener('guestCartUpdated', handleGuestCartUpdate);
            return () => window.removeEventListener('guestCartUpdated', handleGuestCartUpdate);
        }
    }, [isAuthenticated]);

    const currentCartItems = isAuthenticated ? cartItems : guestCartItems;

    // Calculate subtotal
    const subtotal = currentCartItems.reduce((total, item) => {
        if (isAuthenticated) {
            return total + item.discount_price * item.quantity;
        } else {
            const price = item.discount > 0 && item.discount_price 
                ? parseFloat(item.discount_price) 
                : parseFloat(item.original_price || item.price || 0);
            return total + price * item.quantity;
        }
    }, 0);

    // Guest cart functions
    const updateGuestCartQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeGuestCartItem(productId);
            return;
        }
        
        const updatedCart = guestCartItems.map(item => 
            item.product_id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        );
        
        setGuestCartItems(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('guestCartUpdated'));
    };

    const removeGuestCartItem = (productId) => {
        const updatedCart = guestCartItems.filter(item => item.product_id !== productId);
        setGuestCartItems(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('guestCartUpdated'));
        toast.success('Item removed from cart');
    };

    // Authenticated user cart functions (existing logic)
    const incrementQuantity = async (cart_id) => {
        try {
            const updatedCart = cartItems.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedCart);

            await axios.put(`${API_URL}/user/cart/${cart_id}`, {
                quantity: updatedCart.find(item => item.cart_id === cart_id).quantity
            }, getAuthHeaders());
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const decrementQuantity = async (cart_id) => {
        try {
            const currentItem = cartItems.find(item => item.cart_id === cart_id);
            if (currentItem.quantity <= 1) {
                await removeFromCart(cart_id);
                return;
            }

            const updatedCart = cartItems.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity: item.quantity - 1 } : item
            );
            setCartItems(updatedCart);

            await axios.put(`${API_URL}/user/cart/${cart_id}`, {
                quantity: updatedCart.find(item => item.cart_id === cart_id).quantity
            }, getAuthHeaders());
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeFromCart = async (cart_id) => {
        try {
            const updatedCart = cartItems.filter((item) => item.cart_id !== cart_id);
            setCartItems(updatedCart);

            await axios.delete(`${API_URL}/user/cart/${cart_id}`, getAuthHeaders());
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            router.push('/checkout');
        } else {
            // For guests, show guest checkout modal or redirect to guest checkout
            router.push('/guest-checkout');
        }
        dispatch(closeSidebar());
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isAuthenticated ? 'Shopping Cart' : 'Guest Cart'}
                    </h2>
                    <button
                        onClick={() => dispatch(closeSidebar())}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoMdCloseCircle size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {currentCartItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                            <button
                                onClick={() => dispatch(closeSidebar())}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentCartItems.map((item) => {
                                // Safe price calculation with fallbacks
                                let itemPrice = 0;
                                if (isAuthenticated) {
                                    itemPrice = parseFloat(item.discount_price || item.price || 0);
                                } else {
                                    if (item.discount > 0 && item.discount_price) {
                                        itemPrice = parseFloat(item.discount_price);
                                    } else {
                                        itemPrice = parseFloat(item.original_price || item.price || 0);
                                    }
                                }

                                // Ensure itemPrice is a valid number
                                if (isNaN(itemPrice) || itemPrice < 0) {
                                    itemPrice = 0;
                                }

                                // Fix image URL generation for both authenticated and guest users
                                const imageUrl = isAuthenticated
                                    ? getCartItemImageUrl(item)
                                    : getGuestCartImageUrl(item);

                                return (
                                    <div key={isAuthenticated ? item.cart_id : item.product_id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = '/assets/d1.png';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {!isAuthenticated && item.discount > 0 && (
                                                    <span className="text-xs bg-green-600 text-white px-1 rounded">
                                                        -{Math.round(item.discount)}%
                                                    </span>
                                                )}
                                                <span className="text-gray-600 font-bold text-sm">
                                                    ${itemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => isAuthenticated 
                                                    ? decrementQuantity(item.cart_id)
                                                    : updateGuestCartQuantity(item.product_id, item.quantity - 1)
                                                }
                                                className="w-8 h-8 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="text-gray-800 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => isAuthenticated 
                                                    ? incrementQuantity(item.cart_id)
                                                    : updateGuestCartQuantity(item.product_id, item.quantity + 1)
                                                }
                                                className="w-8 h-8 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                            <button
                                                onClick={() => isAuthenticated 
                                                    ? removeFromCart(item.cart_id)
                                                    : removeGuestCartItem(item.product_id)
                                                }
                                                className="w-8 h-8 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex items-center justify-center ml-2"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {currentCartItems.length > 0 && (
                    <div className="border-t p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-800">Total:</span>
                            <span className="font-bold text-xl text-gray-800">${subtotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                            {isAuthenticated ? 'Checkout' : 'Guest Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedCartSidebar;
