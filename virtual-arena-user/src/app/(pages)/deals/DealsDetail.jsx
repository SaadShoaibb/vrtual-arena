'use client'
import CardSidebar from '@/app/components/CartSidebar';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice';
import { openModal } from '@/Store/ReduxSlice/ModalSlice';
import { fetchProductById } from '@/Store/ReduxSlice/productSlice';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';


const DealsDetail = () => {
    const { id: productId } = useParams(); // Extracting id from useParams
    console.log("Product ID:", productId); // Debugging
    const { isAuthenticated } = useSelector((state) => state.userData)
    const dispatch = useDispatch();
    const { singleProduct, singleProductStatus } = useSelector((state) => state.products);
    const [openSection, setOpenSection] = useState(null);
    const { isOpen } = useSelector((state) => state.cartSidebar); // Get the sidebar state
    const { cart } = useSelector((state) => state.cart)
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }
    }, [dispatch, productId]);

    if (singleProductStatus === 'loading') return <p>Loading...</p>;
    if (singleProductStatus === 'failed') return <p>Error loading product.</p>;

    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };
    console.log(singleProduct)

    const detailsData = {
        Description: singleProduct?.description,
        // Ingredients: "Water, Sugar, Flavoring, Preservatives.",
        // Direction: "Use as directed. Store in a cool, dry place.",
        "Shipping Information": `${singleProduct?.shipping_info} shipping days`,
    };

    const handleAddToCart = (product_id) => {
        if (isAuthenticated) {
            // Dispatch addToCart action
            dispatch(addToCart({ product_id, quantity: 1 }));

            // Open the sidebar

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
        <div id='contact' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24'>
                    <img src="/assets/d8.png" alt="" className='min-h-[600px] max-h-[811px] h-full' />
                    <div className='text-white'>
                        <h1 className='text-[40px] md:text-[50px] font-bold text-white '>{singleProduct?.name}</h1>
                        <div className=' flex items-center gap-5  border-b pb-8 '>

                            <p className='text-[26px] leading-none'><span className='line-through'>${singleProduct?.original_price}</span> <span className='font-bold'> ${singleProduct?.discount_price}</span></p>
                            <h1 className='bg-white text-black py-2 px-3 rounded-md text-lg font-bold'>{Math.round(singleProduct?.discount)}%</h1>
                        </div>

                        <h1 className='text-[26px] font-semibold mt-4'>Bundle & Save</h1>
                        <div className=' border border-white rounded-xl mt-4'>
                            <div className='flex justify-between items-center  py-[20px] px-5 border-b'>
                                <div className='flex gap-4 items-center'>
                                    <input type="radio" className='w-5 h-5' />
                                    <h1 className='text-[26px] font-semibold'>One- Time Purchase</h1>

                                </div>
                                <h1 className='text-[26px] font-semibold'>$41.99</h1>

                            </div>
                            <div className='flex justify-between items-center  py-[20px] px-5 '>
                                <div className='flex gap-4 items-center'>
                                    <input type="radio" className='w-5 h-5' />
                                    <h1 className='text-[26px] font-semibold'>One- Time Purchase</h1>

                                </div>
                                <h1 className='text-[26px] font-semibold'>$41.99</h1>

                            </div>

                        </div>


                        <button onClick={()=>handleAddToCart(singleProduct?.product_id)} className='  text-xl mt-4  font-semibold flex items-center justify-center h-fit w-full  my-auto py-2 md:py-4 px-6 md:px-8 gap-3 text-white rounded-lg bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '> <MdOutlineShoppingCart size={20} /><span>Add To Cart</span></button>

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
                                        <p className="mt-2 text-gray-500">{detailsData[section]}</p>
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
