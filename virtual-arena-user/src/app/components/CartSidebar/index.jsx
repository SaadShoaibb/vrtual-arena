'use client';
import { closeSidebar } from '@/Store/ReduxSlice/cartSideBarSlice';
import { API_URL, getAuthHeaders, getMediaBaseUrl } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { useDispatch } from 'react-redux';

const CardSidebar = ({ isOpen, cart }) => {
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState(cart || []);
    useEffect(() => {
        setCartItems(cart)
    }, [cart])
    const router = useRouter()

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
        return total + item.discount_price * item.quantity;
    }, 0);

    // Increment quantity
    const incrementQuantity = async (cart_id) => {
        try {
            const updatedCart = cartItems.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedCart);

            await axios.put(`${API_URL}/user/cart/${cart_id}`, { quantity: updatedCart.find((item) => item.cart_id === cart_id).quantity }, getAuthHeaders());
        } catch (err) {
            console.error('Error incrementing quantity:', err);
        }
    };

    // Decrement quantity
    const decrementQuantity = async (cart_id) => {
        try {
            const updatedCart = cartItems.map((item) =>
                item.cart_id === cart_id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            );
            setCartItems(updatedCart);

            await axios.put(`${API_URL}/user/cart/${cart_id}`, { quantity: updatedCart.find((item) => item.cart_id === cart_id).quantity }, getAuthHeaders());
        } catch (err) {
            console.error('Error decrementing quantity:', err);
        }
    };

    // Remove item from cart
    const removeItem = async (cart_id) => {
        try {
            await axios.delete(`${API_URL}/user/cart/${cart_id}`, getAuthHeaders());
            const updatedCart = cartItems.filter((item) => item.cart_id !== cart_id);
            setCartItems(updatedCart);
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    // Checkout
    const handleCheckout = () => {
       router.push('/checkout')
       dispatch(closeSidebar());
    };

    return (
        <div
            className={`fixed inset-0 z-30 flex justify-end transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}
        >
            {/* Overlay (Dark Background) */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-20 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => dispatch(closeSidebar())} // Close sidebar when clicking overlay
            ></div>

            {/* Sidebar */}
            <div
                className={`h-full bg-grad w-full max-w-xl shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-screen">
                    <button
                        onClick={() => dispatch(closeSidebar())}
                        className="text-white absolute top-5 right-6"
                    >
                        <IoMdCloseCircle size={30} />
                    </button>

                    {cartItems?.length > 0 ? (
                        <div className="p-5 flex flex-col gap-4 overflow-auto justify-between h-full">
                            <div className="flex flex-col gap-4 h-fit">
                                <h2 className="text-3xl text-center text-white font-bold">Your Cart</h2>

                                {cartItems?.map((item) => (
                                    <div key={item.cart_id} className="flex items-center justify-between gap-2">
                                        {(() => {
                                            // Determine correct image source dynamically
                                            const getImageSrc = (cartItem) => {
                                                if (cartItem.item_type === 'tournament') return '/assets/tournament.png';
                                                if (cartItem.images) {
                                                    if (Array.isArray(cartItem.images) && cartItem.images.length) {
                                                        let img = cartItem.images[0];
                                                    if (img.startsWith('/')) img = `${getMediaBaseUrl()}${img}`;
                                                    return img;
                                                    }
                                                    if (typeof cartItem.images === 'string' && cartItem.images.length) {
                                                        let img = cartItem.images.split(',')[0];
                                                    if (img.startsWith('/')) img = `${getMediaBaseUrl()}${img}`;
                                                    return img;
                                                    }
                                                }
                                                return null;
                                            };
                                            const src = getImageSrc(item);
                                            return src ? (
                                                <img src={src} alt={item.name} className="h-20 w-20 object-cover" />
                                            ) : null;
                                        })()}
                                        <div className="flex flex-col gap-5 w-1/2">
                                            <h1 className="text-lg font-semibold capitalize text-white">{item.name}</h1>
                                            <p className="text-white">${item.discount_price}</p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="border flex gap-3 items-center border-white text-white px-3 py-2">
                                                <button onClick={() => decrementQuantity(item.cart_id)} className="leading-none">
                                                    <FaMinus size={20} />
                                                </button>
                                                <span className="text-2xl">{item.quantity}</span>
                                                <button onClick={() => incrementQuantity(item.cart_id)} className="leading-none">
                                                    <FaPlus size={20} />
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.cart_id)} className="underline text-white">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div>
                                    <h1 className='text-white mb-2'>Special Instruction for Seller</h1>
                                    <textarea name="instruction" id="" className='bg-transparent focus:outline-none mb-4 h-20 w-full rounded-lg border border-white'></textarea>
                                </div>
                                <div className="flex gap-3 justify-between items-center">
                                    <h1 className="font-bold text-2xl text-white">Subtotal</h1>
                                    <h1 className="font-semibold text-2xl text-white">${subtotal.toFixed(2)}</h1>
                                </div>
                                <p className='italic text-white  text-center'>Shipping and taxes calculated at Checkout </p>
                                <button onClick={handleCheckout} className="text-xl mt-4 font-semibold flex items-center justify-center w-full py-2 md:py-4 px-6 md:px-8 gap-3 text-black rounded-lg bg-white">
                                    Checkout
                                </button>
                                <button  onClick={()=>router.push('/cart')} className="text-xl mt-4 font-semibold flex items-center justify-center w-full py-2 bg-grad border-white border md:py-4 px-6 md:px-8 gap-3 text-white rounded-lg ">
                                    View Cart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-5 text-white text-center">No Cart Available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardSidebar;