'use client'
import CardSidebar from '@/app/components/CartSidebar'
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice'
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import { fetchProductById, fetchProducts } from '@/Store/ReduxSlice/productSlice'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/Store/ReduxSlice/wishlistSlice'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

const Deals = () => {
    const data = [
        {
            id: 1,
            img: '/assets/d1.png'
        },
        {
            id: 2,
            img: '/assets/d2.png'
        },
        {
            id: 3,
            img: '/assets/d3.png'
        },
        {
            id: 4,
            img: '/assets/d4.png'
        },
        {
            id: 5,
            img: '/assets/d5.png'
        },
        {
            id: 6,
            img: '/assets/d6.png'
        },
        {
            id: 7,
            img: '/assets/d7.png'
        },
        {
            id: 8,
            img: '/assets/d8.png'
        },
    ]

    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.products)
    const { isOpen } = useSelector((state) => state.cartSidebar); // Get the sidebar state
    const { isAuthenticated } = useSelector((state) => state.userData)
    const { wishlist } = useSelector(state => state.wishlist);
    const { singleProduct, singleProductStatus } = useSelector((state) => state.products);
    const { cart } = useSelector((state) => state.cart)
    const [localWishlist, setLocalWishlist] = useState(wishlist);
 
    useEffect(() => {
        setLocalWishlist(wishlist);
    }, [wishlist]);
    console.log(cart)
    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchWishlist());
    }, [])
    console.log(isAuthenticated)
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

    const handleWishlistToggle = (productId) => {
        const isInWishlist = localWishlist.map(item => item.product_id).includes(productId);
        if (isInWishlist) {
            setLocalWishlist(localWishlist.filter(item => item.product_id !== productId));
            dispatch(removeFromWishlist(productId));
        } else {
            setLocalWishlist([...localWishlist, { product_id: productId }]);
            dispatch(addToWishlist(productId));
        }
        setTimeout(() => {
            dispatch(fetchWishlist());
        }, 500);
    };
    return (
        <div id='deals' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y  py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 md:grdc2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10'>
                    {products?.map((data, i) => (


                        <div key={data.id} className='rounded-xl overflow-hidden'>
                            <Link href={`/deals/${data.product_id}`}><img src={'/assets/d1.png'} alt="" className='h-[300px] w-full' /></Link>
                            <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] p-2.5 flex gap-2.5 items-center'>
                                <div className='bg-white h-11 w-[72px] rounded-md flex justify-center items-center'>
                                    <h1 className='text-black text-xl font-bold'>-{Math.round(data?.discount)}%</h1>

                                </div>
                                <h1 className='text-xl text-white line-through'>${data?.original_price} </h1><span className='text-xl text-white font-bold '>${data?.discount_price}</span>
                            </div>
                            <div className=' flex items-center justify-between  bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                <button
                                    onClick={() => handleAddToCart(data?.product_id)} // Call handleAddToCart on button click
                                    className="flex items-center justify-center gap-2 bg-white w-[78%] py-4"
                                >
                                    <img src="/icons/cart.png" alt="" />
                                    <h1 className="text-lg font-semibold">Add To Cart</h1>
                                </button>
                                {/* Wishlist Button */}
                                <div
                                    onClick={() => handleWishlistToggle(data.product_id)}
                                    className='py-4 w-[20%] bg-white flex justify-center cursor-pointer'
                                >
                                    {localWishlist.map(item => item.product_id).includes(data.product_id) ? (
                                        <FaHeart size={26} className="text-red-500 text-xl" />
                                    ) : (
                                        <FaRegHeart size={26} className="text-gray-500 text-xl" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
            <CardSidebar isOpen={isOpen} cart={cart} />
        </div>
    )
}

export default Deals
