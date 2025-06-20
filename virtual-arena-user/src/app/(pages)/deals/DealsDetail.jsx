'use client'
import CardSidebar from '@/app/components/CartSidebar';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice';
import { openModal } from '@/Store/ReduxSlice/ModalSlice';
import { fetchDealById } from '@/Store/ReduxSlice/dealSlice';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';


const DealsDetail = () => {
    const { id: dealId } = useParams(); // Extracting id from useParams
    const { isAuthenticated } = useSelector((state) => state.userData)
    const dispatch = useDispatch();
    const { singleDeal, singleDealStatus, error } = useSelector((state) => state.deals);
    const [openSection, setOpenSection] = useState(null);
    const { isOpen } = useSelector((state) => state.cartSidebar); // Get the sidebar state
    const { cart } = useSelector((state) => state.cart)
    
    useEffect(() => {
        if (dealId) {
            dispatch(fetchDealById(dealId));
        }
    }, [dispatch, dealId]);

    if (singleDealStatus === 'loading') return (
        <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
    );
    
    if (singleDealStatus === 'failed') return (
        <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="text-white text-center">
                <h2 className="text-xl font-bold">Error loading deal</h2>
                <p>{error || "Something went wrong"}</p>
            </div>
        </div>
    );

    if (!singleDeal) return (
        <div className="w-full h-[50vh] flex justify-center items-center bg-blackish">
            <div className="text-white text-center">
                <h2 className="text-xl font-bold">Deal not found</h2>
            </div>
        </div>
    );

    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Use sample data if API doesn't return the expected fields
    const deal = singleDeal || {};
    const displayName = deal.name || "VR Experience Deal";
    const displayOriginalPrice = deal.original_price || 69.99;
    const displayDiscountPrice = deal.discount_price || 41.99;
    const displayDiscount = deal.discount || 40;
    const displayDescription = deal.description || "Enjoy our premium VR experience with this special deal.";
    const displayShippingInfo = deal.shipping_info || "3-7";

    const detailsData = {
        Description: displayDescription,
        "Shipping Information": `${displayShippingInfo} shipping days`,
    };

    const handleAddToCart = () => {
        if (isAuthenticated) {
            // Dispatch addToCart action
            dispatch(addToCart({ product_id: dealId, quantity: 1 }));

            // Add a 500ms delay before fetching the updated cart
            setTimeout(() => {
                dispatch(openSidebar());
                dispatch(fetchCart());
            }, 500);
        } else {
            // If not authenticated, open the login modal
            dispatch(openModal("LOGIN"));
        }
    };

    return (
        <div id='contact' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24'>
                    <img 
                        src={deal.images?.[0] || "/assets/d8.png"} 
                        alt={displayName} 
                        className='min-h-[600px] max-h-[811px] h-full object-cover' 
                    />
                    <div className='text-white'>
                        <h1 className='text-[40px] md:text-[50px] font-bold text-white'>{displayName}</h1>
                        <div className='flex items-center gap-5 border-b pb-8'>
                            <p className='text-[26px] leading-none'>
                                <span className='line-through'>${displayOriginalPrice}</span> 
                                <span className='font-bold'> ${displayDiscountPrice}</span>
                            </p>
                            <h1 className='bg-white text-black py-2 px-3 rounded-md text-lg font-bold'>{Math.round(displayDiscount)}%</h1>
                        </div>

                        <h1 className='text-[26px] font-semibold mt-4'>Bundle & Save</h1>
                        <div className='border border-white rounded-xl mt-4'>
                            <div className='flex justify-between items-center py-[20px] px-5 border-b'>
                                <div className='flex gap-4 items-center'>
                                    <input type="radio" className='w-5 h-5' />
                                    <h1 className='text-[26px] font-semibold'>One-Time Purchase</h1>
                                </div>
                                <h1 className='text-[26px] font-semibold'>${displayDiscountPrice}</h1>
                            </div>
                            <div className='flex justify-between items-center py-[20px] px-5'>
                                <div className='flex gap-4 items-center'>
                                    <input type="radio" className='w-5 h-5' />
                                    <h1 className='text-[26px] font-semibold'>Subscription (Save 10%)</h1>
                                </div>
                                <h1 className='text-[26px] font-semibold'>${(displayDiscountPrice * 0.9).toFixed(2)}</h1>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddToCart} 
                            className='text-xl mt-4 font-semibold flex items-center justify-center h-fit w-full my-auto py-2 md:py-4 px-6 md:px-8 gap-3 text-white rounded-lg bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'
                        >
                            <MdOutlineShoppingCart size={20} /><span>Add To Cart</span>
                        </button>

                        <h1 className='text-xl font-semibold pb-[18px] border-b mt-7'>Add to Wishlist</h1>
                        <div>
                            {Object.keys(detailsData).map((section) => (
                                <div key={section} className="text-xl font-semibold mt-3 pb-[18px] border-b">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => handleToggle(section)}
                                    >
                                        <h1>{section}</h1>
                                        <p>{openSection === section ? "−" : "+"}</p>
                                    </div>
                                    {openSection === section && (
                                        <p className="mt-2 text-gray-400">{detailsData[section]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <CardSidebar isOpen={isOpen} cart={cart} />
        </div>
    )
}

export default DealsDetail
