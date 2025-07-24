'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/Store/ReduxSlice/productSlice'
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/Store/ReduxSlice/wishlistSlice'
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CardSidebar from '@/app/components/CartSidebar'
import UnifiedCartSidebar from '@/app/components/UnifiedCartSidebar'
import GuestProductModal from '@/app/components/GuestProductModal'

import { getMediaBaseUrl } from '@/utils/ApiUrl';
import toast from 'react-hot-toast';
import { formatDisplayPrice } from '@/app/utils/currency';

const Merchandises = ({ locale = 'en' }) => {
    const dispatch = useDispatch()
    const { products, status, error } = useSelector(state => state.products)
    const { isAuthenticated } = useSelector(state => state.userData)
    const { isOpen } = useSelector(state => state.cartSidebar)
    const { cart } = useSelector(state => state.cart)
    const { wishlist } = useSelector(state => state.wishlist)
    const [localWishlist, setLocalWishlist] = useState(wishlist)
    const [activeCategory, setActiveCategory] = useState('all')
    const [showGuestModal, setShowGuestModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [guestCartCount, setGuestCartCount] = useState(0)
    
    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'vr-essentials', name: 'VR Essentials', description: 'Eye masks, comfort accessories and more' },
        { id: 'vr-hardware', name: 'VR Hardware', description: 'Guns, rifles, charging stations, and peripherals' },
        { id: 'branded', name: 'Branded Merchandise', description: 'T-shirts, hats, caps with VRtual Arena logo' },
        { id: 'gift-cards', name: 'Gift Cards & Experiences', description: 'Pre-paid sessions and gift options' }
    ]

    useEffect(() => {
        setLocalWishlist(wishlist)
    }, [wishlist])

    useEffect(() => {
        dispatch(fetchProducts())
        dispatch(fetchWishlist())

        // Update guest cart count for non-authenticated users
        if (!isAuthenticated) {
            updateGuestCartCount()
        }
    }, [dispatch, isAuthenticated])

    // Update guest cart count
    const updateGuestCartCount = () => {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0)
        setGuestCartCount(totalItems)
    }

    // Listen for guest cart updates
    useEffect(() => {
        const handleGuestCartUpdate = () => {
            updateGuestCartCount()
        }

        window.addEventListener('guestCartUpdated', handleGuestCartUpdate)
        return () => window.removeEventListener('guestCartUpdated', handleGuestCartUpdate)
    }, [])

    const addToGuestCart = (product_id, quantity = 1) => {
        const product = products.find(p => p.product_id === product_id);
        if (!product) return;

        try {
            // Get existing guest cart from localStorage
            const existingCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

            // Check if product already exists in cart
            const existingItemIndex = existingCart.findIndex(item => item.product_id === product_id);

            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                existingCart[existingItemIndex].quantity += quantity;
            } else {
                // Process the image properly
                let productImage = product.images || product.image;

                // If images is an array, take the first one
                if (Array.isArray(productImage)) {
                    productImage = productImage[0];
                } else if (typeof productImage === 'string' && productImage.includes(',')) {
                    // If it's a comma-separated string, take the first one
                    productImage = productImage.split(',')[0].trim();
                }

                // Add new item to cart
                const cartItem = {
                    product_id: product.product_id,
                    name: product.name,
                    image: productImage,
                    original_price: product.original_price,
                    discount_price: product.discount_price,
                    discount: product.discount,
                    price: product.price,
                    quantity: quantity
                };

                console.log('Adding product to guest cart:', {
                    product: product,
                    cartItem: cartItem,
                    originalImages: product.images,
                    processedImage: productImage
                });
                existingCart.push(cartItem);
            }

            // Save updated cart to localStorage
            localStorage.setItem('guestCart', JSON.stringify(existingCart));

            // Update cart count and trigger events
            updateGuestCartCount();
            window.dispatchEvent(new Event('guestCartUpdated'));

            // Open sidebar
            dispatch(openSidebar());

            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to guest cart:', error);
            toast.error('Failed to add item to cart');
        }
    };

    const handleAddToCart = (product_id) => {
        if (isAuthenticated) {
            // Dispatch addToCart action for authenticated users
            dispatch(addToCart({ product_id, quantity: 1 }))

            // Add a 500ms delay before fetching the updated cart and opening sidebar
            setTimeout(() => {
                dispatch(openSidebar())
                dispatch(fetchCart())
            }, 500)
        } else {
            // For guests, add to guest cart and open sidebar
            addToGuestCart(product_id, 1);
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
    
    // Function to get proper image URL (works in dev & prod)
    const getImageUrl = (images) => {
        if (!images || !images.length) return '/assets/d1.png';

        const imageUrl = images[0];

        // If it's already absolute, ensure it uses https when pointing to vrtualarena.ca
        if (/^https?:\/\//i.test(imageUrl)) {
            return imageUrl.replace('http://', 'https://');
        }

        const base = getMediaBaseUrl();

        // imageUrl may start with '/' (stored correctly) or without
        return imageUrl.startsWith('/') ? `${base}${imageUrl}` : `${base}/${imageUrl}`;
    };

    // Filter products based on selected category
    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(product => {
            switch(activeCategory) {
                case 'vr-essentials':
                    return product.category === 'VR Essentials';
                case 'vr-hardware':
                    return product.category === 'VR Hardware';
                case 'branded':
                    return product.category === 'Branded Merchandise';
                case 'gift-cards':
                    return product.category === 'Gift Cards';
                default:
                    return true;
            }
        });

    if (status === 'loading') {
        return (
            <div className="w-full h-full bg-blackish flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
        )
    }

    if (status === 'failed') {
        return (
            <div className="w-full h-full bg-blackish flex justify-center items-center py-20">
                <div className="text-white text-center">
                    <h2 className="text-xl font-bold">Failed to load products</h2>
                    <p>{error || "Something went wrong"}</p>
                </div>
            </div>
        )
    }

    return (
        <div id='Merchandises' className={`w-full h-full bg-blackish`}>
            {/* Category Navigation */}
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Shop by Category</h2>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-full transition-all ${
                                activeCategory === category.id 
                                    ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white font-bold'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    
                    {activeCategory !== 'all' && (
                        <div className="mb-8 text-center">
                            <p className="text-white text-lg">
                                {categories.find(c => c.id === activeCategory)?.description}
                            </p>
                            {activeCategory === 'vr-essentials' && (
                                <p className="text-green-400 font-bold mt-2">Eye masks starting at $11.99 - 50% less than Amazon price!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className='w-full mx-auto max-w-[1600px] border-y py-[50px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                {filteredProducts && filteredProducts.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {filteredProducts.map((product) => (
                            <div key={product.product_id} className='rounded-xl overflow-hidden bg-gray-900 hover:shadow-xl hover:shadow-purple-900/20 transition-all transform hover:-translate-y-1'>
                                <Link href={`/merchandise/${product.product_id}`} className="block relative group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity"></div>
                                    <img 
                                        src={getImageUrl(product.images)} 
                                        alt={product.name} 
                                        className='h-[300px] w-full object-cover' 
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                                        <p className="text-white text-sm">Click for details</p>
                                    </div>
                                    <div className="bg-blackish p-4 text-center">
                                        <h3 className="text-white text-lg font-medium truncate">{product.name}</h3>
                                    </div>
                                </Link>
                                <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] p-4 flex justify-between items-center'>
                                    <div className="flex items-center gap-2">
                                        {product.discount > 0 && (
                                            <div className='bg-white h-8 w-[60px] rounded-md flex justify-center items-center'>
                                                <h1 className='text-black text-sm font-bold'>-{Math.round(product?.discount)}%</h1>
                                            </div>
                                        )}
                                        <div>
                                            {product.discount > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className='text-sm text-white line-through'>{formatDisplayPrice(product?.original_price, locale)}</span>
                                                    <span className='text-xl text-white font-bold'>{formatDisplayPrice(product?.discount_price, locale)}</span>
                                                </div>
                                            ) : (
                                                <span className='text-xl text-white font-bold'>{formatDisplayPrice(product?.original_price, locale)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {product.stock > 0 ? (
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">In Stock</span>
                                        ) : (
                                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                    <button 
                                        onClick={() => handleAddToCart(product.product_id)}
                                        disabled={product.stock <= 0}
                                        className={`flex items-center justify-center gap-2 ${product.stock > 0 ? 'bg-white' : 'bg-gray-300'} w-[78%] py-4`}
                                    >
                                        <img src="/icons/cart.png" alt="cart" />
                                        <h1 className={`text-lg font-semibold ${product.stock <= 0 ? 'text-gray-500' : ''}`}>
                                            {product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}
                                        </h1>
                                    </button>
                                    <div
                                        onClick={() => product.stock > 0 && handleWishlistToggle(product.product_id)}
                                        className={`py-4 w-[20%] bg-white flex justify-center ${product.stock > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    >
                                        {localWishlist.map(item => item.product_id).includes(product.product_id) ? (
                                            <FaHeart size={26} className="text-red-500 text-xl" />
                                        ) : (
                                            <FaRegHeart size={26} className={`${product.stock > 0 ? 'text-gray-500' : 'text-gray-300'} text-xl`} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-white text-center py-10">
                        <h2 className="text-xl font-bold">No products available in this category</h2>
                        <p className="mt-4">Check back later for new additions to our shop</p>
                    </div>
                )}
            </div>
            <UnifiedCartSidebar isOpen={isOpen} cart={cart} />

            {/* Guest Cart Button (for non-authenticated users) */}
            {!isAuthenticated && guestCartCount > 0 && (
                <button
                    onClick={() => dispatch(openSidebar())}
                    className="fixed bottom-20 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-colors z-40"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {guestCartCount}
                        </span>
                    </div>
                </button>
            )}



            {/* Guest Product Modal */}
            {showGuestModal && selectedProduct && (
                <GuestProductModal
                    isOpen={showGuestModal}
                    onClose={() => setShowGuestModal(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    )
}

export default Merchandises
