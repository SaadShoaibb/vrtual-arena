'use client'
import React, { useState } from 'react'
import { FaAngleLeft, FaAngleRight, FaStar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
const MerchandiseDetail = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const car = {
        id: 2,
        name: "VR Game Mug",
        description: "Enjoy your favorite drink while playing with our VR game mug. Made of durable ceramic with a VR-themed design, perfect for game enthusiasts.",
        price: 14.99,
        category: "Accessories",
        sizes: ["Standard"],
        colors: ["White", "Black"],
        stock: 100,
        images: [
            "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9vZGllfGVufDB8fDB8fHww",
            "https://plus.unsplash.com/premium_photo-1673827311290-d435f481152e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9vZGllfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1579572331145-5e53b299c64e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9vZGllfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1681493944219-44118cf7754d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG9vZGllfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1542556398-95fb5b9f9b48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVnc3xlbnwwfHwwfHx8MA%3D%3D",
            
        ],
        
        rating: 4.5,
        reviews: [
          {
            user: "Alice Johnson",
            review: "Great mug! It's sturdy and the print is high-quality. I use it every day.",
            rating: 5
          },
          {
            user: "Mark Lee",
            review: "Nice mug but the handle could be a bit bigger. Still, I love the VR design.",
            rating: 4
          }
        ],
        shipping: {
          cost: 3.99,
          deliveryTime: "5-7 business days"
        },
        returnPolicy: "Returns accepted within 30 days of purchase."
      }

    // Handler to go to the next image
    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % car?.images?.length);
    };

    // Handler to go to the previous image
    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? car?.images?.length - 1 : prevIndex - 1
        );
    };

    // Handler to set the main image when clicking on thumbnails
    const setMainImage = (index) => {
        setCurrentIndex(index);
    };
    return (
        <>
            <div id='contact' className={`w-full  h-full  bg-blackish `}>
                <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>

                    <div className='grid grid-cols-5 gap-6 pb-10 bg-blackish'>
                        <div className='col-span-5 lg:col-span-3'>
                            <div className='flex justify-between '>
                                <div className='flex flex-col mb-4 pl-4  md:pl-6  lg:pl-10'>
                                    <h1 className='text-2xl font-semibold text-white'>{car.name}</h1>
                                    <h3 className='flex items-center gap-1  text-white'>
                                        <FaStar  className='text-white' /> 
                                        <FaStar  className='text-white' /> 
                                        <FaStar  className='text-white' /> 
                                        <FaStar  className='text-white' /> {car.rating}
                                        </h3>
                                </div>

                            </div>
                            <div className="relative flex justify-center items-center">
                                <button
                                    onClick={prevImage}
                                    className="absolute flex justify-center items-center left-0 w-10 h-10 text-24 leading-none bg-white text-purplelight rounded-full "
                                >
                                    <FaAngleLeft />
                                </button>
                                <div className='px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10'>

                                    <img
                                        src={car?.images && car.images.length > 0 ? car.images[currentIndex] : '/placeholder.jpg'}
                                        alt={`Slide ${currentIndex + 1}`}
                                        className="w-full h-[450px] object-cover"
                                    />
                                </div>
                                <button
                                    onClick={nextImage}
                                    className="absolute flex justify-center items-center right-0 w-10 h-10 text-24 leading-none bg-white text-purplelight rounded-full hover:bg-gray-600"
                                >
                                    <FaAngleRight />
                                </button>

                            </div>
                            <div className="flex justify-center items-center overflow-auto scrollbar-hide gap-2 mt-4">
                                {car?.images?.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={` object-cover border-2 rounded-lg cursor-pointer anim3 ${index === currentIndex ? 'border-purplelight w-20 h-20' : 'border-gray w-16 h-16'
                                            }`}
                                        onClick={() => setMainImage(index)}
                                    />
                                ))}
                            </div>


                        </div>
                        <div className=' col-span-5 lg:col-span-2 shadow-shad p-5 h-fit '>
                            <h1 className='text-xl font-medium robo uppercase text-white '>Details</h1>
                            <div className='flex justify-between mt-8 rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Price</h1>
                                <h3 className='text-white'>{car.price}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Category</h1>
                                <h3 className='text-white'>{car.category}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Sizes</h1>
                                <h3 className='text-white'>{car.sizes.map((size)=>(
                                    <span>{size}</span>
                                ))}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Colors</h1>
                                <h3 className='text-white'>{car.colors.map((size)=>(
                                    <span>{size}</span>
                                ))}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Stock</h1>
                                <h3 className='text-white'>{car.stock}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Shipping Cost</h1>
                                <h3 className='text-white'>{car.shipping.cost}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Delivery Time</h1>
                                <h3 className='text-white'>{car.shipping.deliveryTime}</h3>
                            </div>
                            <div className='flex justify-between  rale pb-3 mb-2 border-b border-gray'>
                                <h1 className='font-semibold text-white'>Return Policy</h1>
                                <h3 className='text-white'>{car.returnPolicy}</h3>
                            </div>
                           
                           
                           
                          
                            <div className='flex flex-col w-full gap-3 rale pb-3 mb-2 mt-5'>
                                <button className='bg-green py-2 px-4 rounded-md text-black bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>Add To Cart</button>
                                <button className='bg-red py-2 px-4 rounded-md text-black  bg-white'>Checkout</button>
                            </div>

                        </div>

                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default MerchandiseDetail
