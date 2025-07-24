'use client'
import CardSidebar from '@/app/components/CartSidebar'
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice'
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import { fetchDeals } from '@/Store/ReduxSlice/dealSlice'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/Store/ReduxSlice/wishlistSlice'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { formatDisplayPrice } from '@/app/utils/currency'

const Deals = ({ locale = 'en' }) => {
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
    const { deals, status } = useSelector((state) => state.deals)
    const { isOpen } = useSelector((state) => state.cartSidebar)
    const { isAuthenticated } = useSelector((state) => state.userData)
    const { wishlist } = useSelector(state => state.wishlist)
    const { cart } = useSelector((state) => state.cart)
    const [localWishlist, setLocalWishlist] = useState(wishlist)
 
    useEffect(() => {
        setLocalWishlist(wishlist)
    }, [wishlist])

    useEffect(() => {
        dispatch(fetchDeals())
        dispatch(fetchWishlist())
    }, [dispatch])

    const handleAddToCart = (product_id) => {
        if (isAuthenticated) {
            // Dispatch addToCart action
            dispatch(addToCart({ product_id, quantity: 1 }))

            // Add a 500ms delay before fetching the updated cart
            setTimeout(() => {
                dispatch(openSidebar())
                dispatch(fetchCart())
            }, 500)
        } else {
            // If not authenticated, open the login modal
            dispatch(openModal("LOGIN"))
        }
    }

    const handleWishlistToggle = (productId) => {
        if (!isAuthenticated) {
            dispatch(openModal("LOGIN"))
            return
        }
        
        const isInWishlist = localWishlist.map(item => item.product_id).includes(productId)
        if (isInWishlist) {
            setLocalWishlist(localWishlist.filter(item => item.product_id !== productId))
            dispatch(removeFromWishlist(productId))
        } else {
            setLocalWishlist([...localWishlist, { product_id: productId }])
            dispatch(addToWishlist(productId))
        }
        setTimeout(() => {
            dispatch(fetchWishlist())
        }, 500)
    }

    // If we don't have real deals data yet, use the sample data
    const displayItems = deals && deals.length > 0 ? deals : data

    return (
        <div id='deals' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                {status === 'loading' ? (
                    <div className="w-full flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grdc2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10'>
                        {displayItems.map((item) => (
                            <div key={item.id || item.product_id} className='rounded-xl overflow-hidden'>
                                <Link href={`/deals/${item.product_id || item.id}`}>
                                    <img 
                                        src={item.images?.[0] || '/assets/d1.png'} 
                                        alt={item.name || "Deal"} 
                                        className='h-[300px] w-full object-cover' 
                                    />
                                    <div className="bg-blackish p-2 text-center">
                                        <h3 className="text-white text-lg font-medium truncate">{item.name || `Deal ${item.id}`}</h3>
                                    </div>
                                </Link>
                                <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] p-2.5 flex gap-2.5 items-center'>
                                    <div className='bg-white h-11 w-[72px] rounded-md flex justify-center items-center'>
                                        <h1 className='text-black text-xl font-bold'>-{Math.round(item.discount || 40)}%</h1>
                                    </div>
                                    <h1 className='text-xl text-white line-through'>{formatDisplayPrice(item.original_price || 69.99, locale)}</h1>
                                    <span className='text-xl text-white font-bold'>{formatDisplayPrice(item.discount_price || 41.99, locale)}</span>
                                </div>
                                <div className='flex items-center justify-between bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                    <button
                                        onClick={() => handleAddToCart(item.product_id || item.id)}
                                        className="flex items-center justify-center gap-2 bg-white w-[78%] py-4"
                                    >
                                        <img src="/icons/cart.png" alt="" />
                                        <h1 className="text-lg font-semibold">Add To Cart</h1>
                                    </button>
                                    <div
                                        onClick={() => handleWishlistToggle(item.product_id || item.id)}
                                        className='py-4 w-[20%] bg-white flex justify-center cursor-pointer'
                                    >
                                        {localWishlist.map(wishItem => wishItem.product_id).includes(item.product_id || item.id) ? (
                                            <FaHeart size={26} className="text-red-500 text-xl" />
                                        ) : (
                                            <FaRegHeart size={26} className="text-gray-500 text-xl" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <CardSidebar isOpen={isOpen} cart={cart} />
        </div>
    )
}

export default Deals
