
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { getCartItemImageUrl } from '@/app/utils/imageUtils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { translations } from '@/app/translations';
import { formatDisplayPrice } from '@/app/utils/currency';

const Cart = ({ cart, locale = 'en' }) => {
  const t = translations[locale] || translations.en;
  const [cartItems, setCartItems] = useState(cart || []);
  const router = useRouter();


  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Check if cart has any physical products
  const hasPhysicalProducts = cartItems.some(item => !item.item_type || item.item_type === 'product');
  
  const getPrice = (val) => Number(val) || 0;
  const subtotal = cartItems.reduce((total, item) => total + getPrice(item.discount_price) * (Number(item.quantity) || 0), 0);



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

  const removeItem = async (cart_id) => {
    try {
      await axios.delete(`${API_URL}/user/cart/${cart_id}`, getAuthHeaders());
      setCartItems(cartItems.filter((item) => item.cart_id !== cart_id));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    console.log('Cart Details:', cartItems);
    alert('Checkout functionality will be implemented here.');
  };
  return (
    <div className='bg-blackish text-white '>
      <div className="container mx-auto p-6">
        {cartItems.length > 0 ? (
          <div className='w-full'>
            <div className='w-full hidden md:block'>


              <table className=' min-w-full '>
                <thead>
                  <tr className='border-y'>
                    <th className='p-2'>{t.product}</th>
                    <th className='p-2'>{t.price}</th>
                    <th className='p-2'>{t.quantity}</th>
                    <th className='p-2'>{t.total}</th>

                  </tr>
                </thead>
                <tbody>
                  {cartItems?.map((item) => (
                    <tr key={item.cart_id} className='border-b'>
                      <td className='p-2 flex items-center gap-6'>
                        <button onClick={() => removeItem(item.cart_id)} >
                          <IoClose size={24} />
                        </button>
                        <img src={getCartItemImageUrl(item)} className="h-20 w-20 object-cover" alt={item.name} />
                        <div>
                          <h2 className="text-lg font-semibold">{item.name}</h2>
                          {item.item_type === 'tournament' && (
                            <>
                              <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded">Tournament</span>
                              {(item.rules || item.requirements) && (
                                <div className="mt-2 text-sm text-gray-300">
                                  {item.rules && (
                                    <div className="mb-2">
                                      <strong>Rules:</strong>
                                      <ul className="list-disc list-inside ml-2 text-xs">
                                        {(typeof item.rules === 'string' ?
                                          item.rules.split('\n').filter(rule => rule.trim()) :
                                          Array.isArray(item.rules) ? item.rules :
                                          [
                                            'All participants must be 13 years or older',
                                            'Valid government-issued ID required for registration',
                                            'Players must use provided VR equipment only',
                                            'Unsportsmanlike conduct will result in disqualification',
                                            'Tournament organizers\' decisions are final'
                                          ]
                                        ).map((rule, index) => (
                                          <li key={index}>{rule.trim()}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {item.requirements && (
                                    <div>
                                      <strong>Requirements:</strong>
                                      <ul className="list-disc list-inside ml-2 text-xs">
                                        {(typeof item.requirements === 'string' ?
                                          item.requirements.split('\n').filter(req => req.trim()) :
                                          Array.isArray(item.requirements) ? item.requirements :
                                          [
                                            'Signed waiver form mandatory',
                                            'Comfortable clothing recommended',
                                            'No loose jewelry or accessories',
                                            'Arrive 30 minutes before scheduled match time',
                                            'Motion sickness tolerance recommended'
                                          ]
                                        ).map((req, index) => (
                                          <li key={index}>{req.trim()}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className='p-2 text-center'>{formatDisplayPrice(item.discount_price, locale)}</td>
                      <td className='p-2 flex justify-center'>
                        <div className='flex items-center mt-2 border w-fit'>
                          {/* For tournament and event tickets, we typically don't allow quantity changes */}
                          {(item.item_type === 'tournament' || item.item_type === 'event') ? (
                            <span className="px-4">{item.quantity}</span>
                          ) : (
                            <>
                              <button onClick={() => decrementQuantity(item.cart_id)} className="p-2 border-r rounded"><FaMinus /></button>
                              <span className="px-4">{item.quantity}</span>
                              <button onClick={() => incrementQuantity(item.cart_id)} className="p-2 border-l rounded"><FaPlus /></button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className='p-2 text-center'>
                        {formatDisplayPrice((Number(item.discount_price) || 0) * item.quantity, locale)}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
            {cartItems?.map((item) => (
              <div key={item.cart_id} className='border-b flex md:hidden flex-col sm:flex-row items-start sm:items-center  w-full gap-2 sm:gap-6 pb-4'>
                <div className='p-2 flex items-center gap-6 w-full sm:w-1/2'>
                  <button onClick={() => removeItem(item.cart_id)} >
                    <IoClose size={24} />
                  </button>
                  <img src={getCartItemImageUrl(item)} className="h-20 w-20 object-cover" alt={item.name} />
                  <div>
                    <h2 className="text-lg font-semibold text-nowrap">{item.name}</h2>
                    {item.item_type === 'tournament' && (
                      <>
                        <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded">Tournament</span>
                        {(item.rules || item.requirements) && (
                          <div className="mt-2 text-sm text-gray-300">
                            {item.rules && (
                              <div className="mb-2">
                                <strong>Rules:</strong>
                                <ul className="list-disc list-inside ml-2 text-xs">
                                  {(typeof item.rules === 'string' ?
                                    item.rules.split('\n').filter(rule => rule.trim()) :
                                    Array.isArray(item.rules) ? item.rules :
                                    [
                                      'All participants must be 13 years or older',
                                      'Valid government-issued ID required for registration',
                                      'Players must use provided VR equipment only',
                                      'Unsportsmanlike conduct will result in disqualification',
                                      'Tournament organizers\' decisions are final'
                                    ]
                                  ).map((rule, index) => (
                                    <li key={index}>{rule.trim()}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {item.requirements && (
                              <div>
                                <strong>Requirements:</strong>
                                <ul className="list-disc list-inside ml-2 text-xs">
                                  {(typeof item.requirements === 'string' ?
                                    item.requirements.split('\n').filter(req => req.trim()) :
                                    Array.isArray(item.requirements) ? item.requirements :
                                    [
                                      'Signed waiver form mandatory',
                                      'Comfortable clothing recommended',
                                      'No loose jewelry or accessories',
                                      'Arrive 30 minutes before scheduled match time',
                                      'Motion sickness tolerance recommended'
                                    ]
                                  ).map((req, index) => (
                                    <li key={index}>{req.trim()}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {item.item_type === 'event' &&
                      <span className="ml-2 text-xs bg-blue-700 text-white px-2 py-1 rounded">Event</span>
                    }
                  </div>
                </div>
                <div className='flex flex-row sm:flex-row items-center'>

                  <div className='p-2 text-center'>{formatDisplayPrice(item.discount_price, locale)}</div>
                  <div className='p-2 flex justify-center'>
                    <div className='flex items-center mt-2 border w-fit h-fit'>
                      {/* For tournament and event tickets, we typically don't allow quantity changes */}
                      {(item.item_type === 'tournament' || item.item_type === 'event') ? (
                        <span className="px-4">{item.quantity}</span>
                      ) : (
                        <>
                          <button onClick={() => decrementQuantity(item.cart_id)} className="p-2 border-r rounded"><FaMinus /></button>
                          <span className="px-4">{item.quantity}</span>
                          <button onClick={() => incrementQuantity(item.cart_id)} className="p-2 border-l rounded"><FaPlus /></button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='p-2 text-center'>
                    {formatDisplayPrice((Number(item.discount_price) || 0) * item.quantity, locale)}
                  </div>
                </div>
              </div>
            ))}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10'>
              <div className='p-4 bg-gray-900'>
                <h1 className="text-2xl font-bold mb-4 uppercase my-4 text-center text-wrap-balance">{t.specialInstructionForSeller}</h1>
                <textarea className="w-full h-40 p-2 border border-gray-300 rounded bg-transparent" placeholder={t.writeYourMessageHere}></textarea>
              </div>
              <div className='p-4 bg-gray-900'>
                <h1 className="text-2xl font-bold mb-4 uppercase my-4 text-center text-wrap-balance">{t.cartsTotal}</h1>
                <div className="flex justify-between px-2 border-b-2 pb-2"><h1 className="font-bold">{t.subtotal}</h1><h1>{formatDisplayPrice(subtotal, locale)}</h1></div>
                {hasPhysicalProducts && (
                  <div className="flex justify-between px-2 mt-4 border-b-2 pb-2">
                    <h1 className="font-bold">{t.shipping}</h1>
                    <h1 className="text-wrap-balance">{t.shippingTaxesCalculated}</h1>
                  </div>
                )}


                <button onClick={() => router.push(`/checkout?locale=${locale}`)} className="bg-grad w-full py-2 text-white mt-4 font-bold transition-colors duration-500">{t.proceedToCheckout}</button>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-center text-gray-500 text-wrap-balance">{t.yourCartIsEmpty}</p>
        )}

      </div>
    </div>
  )
}

export default Cart
