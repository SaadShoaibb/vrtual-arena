
import { API_URL, getAuthHeaders, getMediaBaseUrl } from '@/utils/ApiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

const Cart = ({ cart }) => {
  const [cartItems, setCartItems] = useState(cart || []);
  const router = useRouter();


  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Check if cart has any physical products
  const hasPhysicalProducts = cartItems.some(item => !item.item_type || item.item_type === 'product');
  
  const subtotal = cartItems.reduce((total, item) => total + item.discount_price * item.quantity, 0);

  // Helper: return correct image URL or null
  const getImageSrc = (cartItem) => {
    if (cartItem.item_type === 'tournament') return '/assets/tournament.png';

    if (cartItem.images) {
      // images can be an array or comma-separated string
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
    return null; // no image available
  };

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
                    <th className='p-2'>Product</th>
                    <th className='p-2'>Price</th>
                    <th className='p-2'>quantity</th>
                    <th className='p-2'>Total</th>

                  </tr>
                </thead>
                <tbody>
                  {cartItems?.map((item) => (
                    <tr key={item.cart_id} className='border-b'>
                      <td className='p-2 flex items-center gap-6'>
                        <button onClick={() => removeItem(item.cart_id)} >
                          <IoClose size={24} />
                        </button>
                        {getImageSrc(item) && (
                            <img src={getImageSrc(item)} className="h-20 w-20 object-cover" alt={item.name} />
                          )}
                        <div>
                          <h2 className="text-lg font-semibold">{item.name}</h2>
                          {item.item_type === 'tournament' && 
                            <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded">Tournament</span>
                          }
                        </div>
                      </td>
                      <td className='p-2 text-center'>${item.discount_price}</td>
                      <td className='p-2 flex justify-center'>
                        <div className='flex items-center mt-2 border w-fit'>
                          {/* For tournament tickets, we typically don't allow quantity changes */}
                          {item.item_type === 'tournament' ? (
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
                        ${item.discount_price * item.quantity}
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
                  {getImageSrc(item) && (
                            <img src={getImageSrc(item)} className="h-20 w-20 object-cover" alt={item.name} />
                          )}
                  <div>
                    <h2 className="text-lg font-semibold text-nowrap">{item.name}</h2>
                    {item.item_type === 'tournament' && 
                      <span className="ml-2 text-xs bg-purple-700 text-white px-2 py-1 rounded">Tournament</span>
                    }
                  </div>
                </div>
                <div className='flex flex-row sm:flex-row items-center'>

                  <div className='p-2 text-center'>${item.discount_price}</div>
                  <div className='p-2 flex justify-center'>
                    <div className='flex items-center mt-2 border w-fit h-fit'>
                      {/* For tournament tickets, we typically don't allow quantity changes */}
                      {item.item_type === 'tournament' ? (
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
                    ${item.discount_price * item.quantity}
                  </div>
                </div>
              </div>
            ))}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10'>
              <div className='p-4 bg-gray-900'>
                <h1 class="text-2xl font-bold mb-4 uppercase my-4 text-center">Special instruction for seller</h1>
                <textarea class="w-full h-40 p-2 border border-gray-300 rounded bg-transparent" placeholder="Write you message here.."></textarea>
              </div>
              <div className='p-4 bg-gray-900'>
                <h1 class="text-2xl font-bold mb-4 uppercase my-4 text-center">Carts Total</h1>
                <div class="flex justify-between px-2 border-b-2 pb-2"><h1 class="font-bold ">Subtotal</h1><h1>${subtotal.toFixed(2)}</h1></div>
                {hasPhysicalProducts && (
                  <div class="flex justify-between px-2 mt-4 border-b-2 pb-2">
                    <h1 class="font-bold ">Shipping</h1>
                    <h1>Shipping &amp; taxes calculated at checkout</h1>
                  </div>
                )}


                <button onClick={() => router.push('/checkout')} class="bg-grad w-full py-2 text-white  mt-4 font-bold transition-colors duration-500">PROOCEED TO CHECKOUT</button>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

      </div>
    </div>
  )
}

export default Cart
