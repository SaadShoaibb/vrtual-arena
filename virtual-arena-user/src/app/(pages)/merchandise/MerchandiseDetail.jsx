'use client'
import React, { useState, useEffect } from 'react';
import { getMediaBaseUrl } from '@/utils/ApiUrl';
import { FaAngleLeft, FaAngleRight, FaStar } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice'
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import CardSidebar from '@/app/components/CartSidebar'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/Store/ReduxSlice/wishlistSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const MerchandiseDetail = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector(state => state.userData)
    const { isOpen } = useSelector(state => state.cartSidebar)
    const { cart } = useSelector(state => state.cart)
    const { wishlist } = useSelector(state => state.wishlist)
    const [openSection, setOpenSection] = useState('Description') // Open description by default
    const [localWishlist, setLocalWishlist] = useState(wishlist)

    useEffect(() => {
        setLocalWishlist(wishlist)
    }, [wishlist])

    // Function to get proper image URL (works in dev & prod)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/assets/d1.png';

        // Already absolute
        if (/^https?:\/\//i.test(imagePath)) return imagePath;

        const base = getMediaBaseUrl();
        return imagePath.startsWith('/') ? `${base}${imagePath}` : `${base}/${imagePath}`;
    };

    // Handler to go to the next image
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (product?.images?.length || 1))
    }

    // Handler to go to the previous image
    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? (product?.images?.length - 1 || 0) : prevIndex - 1
        )
    }

    // Handler to set the main image when clicking on thumbnails
    const setMainImage = (index) => {
        setCurrentIndex(index)
    }

    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    const handleAddToCart = () => {
        if (isAuthenticated) {
            // Dispatch addToCart action
            dispatch(addToCart({ product_id: product.product_id, quantity: 1 }))

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

    const handleWishlistToggle = () => {
        if (!isAuthenticated) {
            dispatch(openModal("LOGIN"))
            return
        }
        
        const isInWishlist = localWishlist.map(item => item.product_id).includes(product.product_id)
        if (isInWishlist) {
            setLocalWishlist(localWishlist.filter(item => item.product_id !== product.product_id))
            dispatch(removeFromWishlist(product.product_id))
        } else {
            setLocalWishlist([...localWishlist, { product_id: product.product_id }])
            dispatch(addToWishlist(product.product_id))
        }
        setTimeout(() => {
            dispatch(fetchWishlist())
        }, 500)
    }

    // Details data for accordion
    const detailsData = {
        Description: product?.description || "No description available",
        "Shipping Information": product?.shipping_info ? `${product.shipping_info} shipping days` : "Standard shipping applies",
    }

    if (!product) {
        return null
    }

    return (
        <>
            <div id='contact' className={`w-full h-full bg-blackish`}>
                <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24'>
                        <div className="relative flex flex-col">
                            <div className="relative flex justify-center items-center">
                                <button
                                    onClick={prevImage}
                                    className="absolute flex justify-center items-center left-0 w-10 h-10 text-24 leading-none bg-white text-purplelight rounded-full z-10"
                                >
                                    <FaAngleLeft />
                                </button>
                                <img
                                    src={product.images && product.images.length > 0 ? getImageUrl(product.images[currentIndex]) : '/assets/d1.png'}
                                    alt={`${product.name} - Image ${currentIndex + 1}`}
                                    className="w-full min-h-[600px] max-h-[811px] object-cover"
                                />
                                <button
                                    onClick={nextImage}
                                    className="absolute flex justify-center items-center right-0 w-10 h-10 text-24 leading-none bg-white text-purplelight rounded-full hover:bg-gray-600 z-10"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>
                            {product?.images && product.images.length > 1 && (
                                <div className="flex justify-center items-center overflow-auto scrollbar-hide gap-2 mt-4">
                                    {product.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={getImageUrl(img)}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`object-cover border-2 rounded-lg cursor-pointer anim3 ${index === currentIndex ? 'border-purplelight w-20 h-20' : 'border-gray w-16 h-16'}`}
                                            onClick={() => setMainImage(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='text-white'>
                            <h1 className='text-[40px] md:text-[50px] font-bold text-white'>{product.name}</h1>
                            <div className='flex items-center gap-5 border-b pb-8'>
                                <p className='text-[26px] leading-none'>
                                    <span className='line-through'>${product.original_price}</span> 
                                    <span className='font-bold'> ${product.discount_price}</span>
                                </p>
                                <h1 className='bg-white text-black py-2 px-3 rounded-md text-lg font-bold'>{Math.round(product.discount)}%</h1>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                className='text-xl mt-4 font-semibold flex items-center justify-center h-fit w-full my-auto py-2 md:py-4 px-6 md:px-8 gap-3 text-white rounded-lg bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'
                            >
                                <MdOutlineShoppingCart size={20} />
                                <span>Add To Cart</span>
                            </button>

                            <div 
                                onClick={handleWishlistToggle}
                                className='flex items-center gap-2 cursor-pointer text-xl font-semibold pb-[18px] border-b mt-7'
                            >
                                {localWishlist.map(item => item.product_id).includes(product.product_id) ? (
                                    <>
                                        <FaHeart size={20} className="text-red-500" />
                                        <span>Remove from Wishlist</span>
                                    </>
                                ) : (
                                    <>
                                        <FaRegHeart size={20} />
                                        <span>Add to Wishlist</span>
                                    </>
                                )}
                            </div>

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
                                            <div className="mt-2 text-gray-400 whitespace-pre-wrap">
                                                {section === "Description" ? (
                                                    <div dangerouslySetInnerHTML={{ __html: detailsData[section].replace(/\n/g, '<br/>') }} />
                                                ) : (
                                                    detailsData[section]
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <CardSidebar isOpen={isOpen} cart={cart} />
            </div>
        </>
    )
}

export default MerchandiseDetail
