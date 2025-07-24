'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { openSidebar } from '@/Store/ReduxSlice/cartSideBarSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, getPaymentApiUrl } from '@/utils/ApiUrl';

const GuestProductModal = ({ isOpen, onClose, product }) => {
  const [userType, setUserType] = useState('user'); // 'user' or 'guest'
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const dispatch = useDispatch();
  const [guestData, setGuestData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: ''
  });
  const [step, setStep] = useState(1); // 1: user type, 2: guest details, 3: payment
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleGuestDataChange = (e) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeSelect = (selectedType) => {
    setUserType(selectedType);
    if (selectedType === 'user') {
      // Redirect to login
      onClose();
      router.push('/login');
    } else {
      setStep(2); // Go to guest details
    }
  };

  const handleGuestDetailsSubmit = (e) => {
    e.preventDefault();
    if (!guestData.guest_name || !guestData.guest_email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(3); // Go to payment
  };

  const addToGuestCart = () => {
    try {
      // Validate price
      if (!itemPrice || itemPrice <= 0) {
        toast.error("Product price is not available. Please contact support or try again later.");
        return;
      }

      // Get existing guest cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.product_id === product.product_id);

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Process the image properly - extract first image from array or comma-separated string
        let productImage = product.images || product.image;

        if (Array.isArray(productImage)) {
          productImage = productImage[0];
        } else if (typeof productImage === 'string' && productImage.includes(',')) {
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
          quantity: quantity
        };

        console.log('Adding product to guest cart from modal:', {
          product: product,
          cartItem: cartItem,
          originalImages: product.images,
          processedImage: productImage
        });
        existingCart.push(cartItem);
      }

      // Save updated cart to localStorage
      localStorage.setItem('guestCart', JSON.stringify(existingCart));

      toast.success(`${product.name} added to cart!`);

      // Trigger cart update event and open sidebar
      window.dispatchEvent(new Event('guestCartUpdated'));
      dispatch(openSidebar());

      onClose();
    } catch (error) {
      console.error('Error adding to guest cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const handlePurchase = async () => {
    try {
      // Validate price
      if (!itemPrice || itemPrice <= 0) {
        console.error('Product price validation failed:', {
          itemPrice,
          productData: product,
          allPriceFields: {
            price: product?.price,
            discounted_price: product?.discounted_price,
            original_price: product?.original_price,
            selling_price: product?.selling_price,
            current_price: product?.current_price
          }
        });
        toast.error("Product price is not available. Please contact support or try again later.");
        return;
      }

      // Create guest order directly and proceed to checkout
      const orderPayload = {
        guest_name: guestData.guest_name,
        guest_email: guestData.guest_email,
        guest_phone: guestData.guest_phone,
        payment_method: paymentMethod,
        items: [{
          product_id: product.product_id,
          quantity: quantity,
          price: itemPrice
        }],
        total_amount: itemPrice * quantity,
        is_guest_order: true
      };

      console.log('Creating guest order:', orderPayload);

      // Create guest order
      const orderResponse = await axios.post(`${API_URL}/user/guest-order`, orderPayload);
      const order = orderResponse.data.order;

      if (paymentMethod === 'cod') {
        // For COD, just show success message
        toast.success(`Order placed successfully! Order Reference: ${order.order_reference}`);
        onClose();
      } else {
        // For online payment, create Stripe checkout session
        console.log('Creating checkout session for guest order...');
        const checkoutPayload = {
          user_id: 0, // Guest user
          amount: itemPrice * quantity,
          entity_type: 'order',
          entity_id: order.order_id,
          guest_info: {
            name: guestData.guest_name,
            email: guestData.guest_email,
            phone: guestData.guest_phone
          }
        };

        console.log('Checkout payload:', checkoutPayload);

        // Use the utility function to get the correct payment API URL
        const paymentUrl = getPaymentApiUrl();

        const checkoutResponse = await axios.post(`${paymentUrl}/create-checkout-session`, checkoutPayload);

        console.log('Checkout response:', checkoutResponse.data);

        // Validate the response and redirect
        if (checkoutResponse.data && checkoutResponse.data.url) {
          console.log('Redirecting to Stripe checkout:', checkoutResponse.data.url);
          window.location.href = checkoutResponse.data.url;
        } else {
          console.error('Invalid checkout response - no URL provided');
          toast.error('Payment session created but redirect URL is missing. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Error creating guest purchase:', error);
      toast.error(error?.response?.data?.message || 'Failed to create purchase');
    }
  };

  if (!isOpen) return null;

  // Get the correct product price (prioritize discounted price)
  const getProductPrice = () => {
    // If product has a discount and discount_price, use that
    if (product?.discount > 0 && product?.discount_price) {
      const discountPrice = parseFloat(product.discount_price);
      if (!isNaN(discountPrice) && discountPrice > 0) {
        return discountPrice;
      }
    }

    // Otherwise try different price fields in order of preference
    const priceFields = [
      product?.discount_price,  // Try discount price first
      product?.price,
      product?.original_price,
      product?.selling_price,
      product?.current_price
    ];

    for (let price of priceFields) {
      if (price !== null && price !== undefined && price !== '' && !isNaN(price)) {
        const numPrice = parseFloat(price);
        if (numPrice > 0) {
          return numPrice;
        }
      }
    }
    return 0;
  };

  const itemPrice = getProductPrice();

  const totalPrice = itemPrice * quantity;

  // Debug product data
  console.log('Product data in GuestProductModal:', product);
  console.log('Available price fields:', {
    price: product?.price,
    discounted_price: product?.discounted_price,
    original_price: product?.original_price,
    selling_price: product?.selling_price
  });
  console.log('Selected item price:', itemPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full shadow-lg mx-4">
        {/* Step 1: User Type Selection */}
        {step === 1 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-2xl font-bold">Purchase Product</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{product?.name}</h3>
              <div className="flex items-center gap-2">
                {product?.discount > 0 ? (
                  <>
                    <div className='bg-white h-6 w-[50px] rounded-md flex justify-center items-center'>
                      <span className='text-black text-xs font-bold'>-{Math.round(product?.discount)}%</span>
                    </div>
                    <span className='text-sm text-gray-400 line-through'>${parseFloat(product?.original_price || 0).toFixed(2)}</span>
                    <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <p className="text-white mb-6">How would you like to purchase?</p>
            
            <div className="flex flex-col gap-4 mb-6">
              <button
                onClick={() => handleUserTypeSelect('user')}
                className="flex items-center gap-3 p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                <span className="text-white font-medium">I have an account</span>
              </button>
              
              <button
                onClick={() => handleUserTypeSelect('guest')}
                className="flex items-center gap-3 p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                <span className="text-white font-medium">Continue as guest</span>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Guest Details Form */}
        {step === 2 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-2xl font-bold">Guest Purchase</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{product?.name}</h3>
              <div className="flex items-center gap-2">
                {product?.discount > 0 ? (
                  <>
                    <div className='bg-white h-6 w-[50px] rounded-md flex justify-center items-center'>
                      <span className='text-black text-xs font-bold'>-{Math.round(product?.discount)}%</span>
                    </div>
                    <span className='text-sm text-gray-400 line-through'>${parseFloat(product?.original_price || 0).toFixed(2)}</span>
                    <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            <form onSubmit={handleGuestDetailsSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={guestData.guest_name}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="guest_email"
                  value={guestData.guest_email}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={guestData.guest_phone}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Quantity and Purchase */}
        {step === 3 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-2xl font-bold">Complete Purchase</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{product?.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                {product?.discount > 0 ? (
                  <>
                    <div className='bg-white h-6 w-[50px] rounded-md flex justify-center items-center'>
                      <span className='text-black text-xs font-bold'>-{Math.round(product?.discount)}%</span>
                    </div>
                    <span className='text-sm text-gray-400 line-through'>${parseFloat(product?.original_price || 0).toFixed(2)}</span>
                    <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)} each</span>
                  </>
                ) : (
                  <span className='text-lg text-white font-bold'>${itemPrice.toFixed(2)} each</span>
                )}
              </div>
              <p className="text-blue-400 text-sm">Purchasing as: {guestData.guest_name}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
                >
                  -
                </button>
                <span className="text-white text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-gray-300 mt-2">Total: ${totalPrice.toFixed(2)}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Payment Method
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online-modal"
                    name="paymentMethodModal"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <label htmlFor="online-modal" className="ml-2 text-white text-sm">
                    💳 Online Payment (Credit/Debit Card)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod-modal"
                    name="paymentMethodModal"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cod-modal" className="ml-2 text-white text-sm">
                    💵 Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={addToGuestCart}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {paymentMethod === 'cod' ? 'Place Order' : 'Buy Now'}
              </button>
            </div>
          </>
        )}

        {/* Close button for all steps */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GuestProductModal;
