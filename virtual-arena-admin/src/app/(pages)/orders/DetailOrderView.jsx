'use client'
import { fetchReviews } from '@/Store/ReduxSlice/fetchReviewSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const DetailOrderView = ({ data, }) => {
    console.log(data)
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.reviews);
    const entity_id = data?.order_id
    const entity_type = "PRODUCT"
    useEffect(() => {
        dispatch(fetchReviews({ entity_type, entity_id }));
    }, [dispatch, entity_type, entity_id]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    console.log(reviews)
    return (
        <div className="text-white overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gradiant">Order Details</h2>
            <div className='bg-blackish rounded-2xl p-6 '>
                <h1 className='text-xl font-semibold text-white '>Summary</h1>

                <p className="flex justify-between items-center  border-gray-600 py-2">
                    <strong className='text-gray-500'>Order ID:</strong> {data?.order_id}
                </p>
                <p className="flex justify-between items-center  border-gray-600 py-2">
                    <strong className='text-gray-500'>Status:</strong> {data?.status}
                </p>
                <p className="flex justify-between items-center  border-gray-600 py-2">
                    <strong className='text-gray-500'>Order Date:</strong> {data?.created_at}
                </p>
                <p className="flex justify-between items-center  border-gray-600 py-2">
                    <strong className='text-gray-500'>User Name:</strong> {data?.user?.name}
                </p>
                <p className="flex justify-between items-center  border-gray-600 py-2">
                    <strong className='text-gray-500'>User Email:</strong> {data?.user?.email}
                </p>
                <p className="flex justify-between items-center  text-gradiant border-gray-600 py-2">
                    <strong className='text-gray-500'>Total Amount:</strong> ${data?.total_amount}
                </p>

            </div>
            <div className='bg-blackish rounded-2xl p-6 mt-6'>
                <h1 className='text-xl font-semibold text-white '>Shipping Address</h1>

                <p className="flex justify-between items-center  text-gray-500 py-2">
                    {data?.shipping_address?.address}, {data?.shipping_address?.city} ({data?.shipping_address?.zip_code}), {data?.shipping_address?.state}, {data?.shipping_address?.country},
                </p>

            </div>
            <div className='bg-blackish p-6 mt-6 rounded-2xl'>

                <h1 className='text-xl font-semibold text-white mb-4'>Items</h1>
                {data?.items?.length > 0 ? (
                    <table className="min-w-full  bg-blackish text-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-900">
                                {/* <th className="py-3 px-4 border-b text-left">#</th> */}
                                <th className="py-3 px-4 border-b text-left">Name</th>
                                <th className="py-3 px-4 border-b text-left">Color</th>
                                <th className="py-3 px-4 border-b text-left">Discount Price</th>
                                <th className="py-3 px-4 border-b text-left">Original Price</th>
                                <th className="py-3 px-4 border-b text-left">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50 hover:text-black">
                                    {/* <td className="py-3 px-4 border-b">{i + 1}</td> */}
                                    <td className="py-3 px-4 border-b">
                                        <span className='flex gap-2 items-center'>
                                            <img src="/assets/herobg.png" alt="product Image" className='h-12 w-12 ' />
                                            <span className='flex flex-col'>
                                                <span className='text-sm text-gray1 text-nowrap'>Product Name</span>
                                                <span className='font-bold text-nowrap'> {item?.product_name}</span>
                                            </span>
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b">{item?.color}</td>
                                    <td className="py-3 px-4 border-b">${item?.discount_price}</td>
                                    <td className="py-3 px-4 border-b">${item?.original_price}</td>
                                    <td className="py-3 px-4 border-b">{item?.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No items found.</p>
                )}
            </div>

            <div className="p-6 bg-blackish text-white mt-6">
                <h1 className="text-2xl font-bold mb-6">All Reviews</h1>
                {reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <table className="min-w-full bg-blackish text-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-900">
                                <th className="py-3 px-4 border-b text-left">User ID</th>
                                <th className="py-3 px-4 border-b text-left">Entity Type</th>
                                <th className="py-3 px-4 border-b text-left">Entity ID</th>
                                <th className="py-3 px-4 border-b text-left">Rating</th>
                                <th className="py-3 px-4 border-b text-left">Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.review_id} className="hover:bg-gray-50 hover:text-black">
                                    <td className="py-3 px-4 border-b">{review.user_id}</td>
                                    <td className="py-3 px-4 border-b">{review.entity_type}</td>
                                    <td className="py-3 px-4 border-b">{review.entity_id}</td>
                                    <td className="py-3 px-4 border-b">{review.rating}</td>
                                    <td className="py-3 px-4 border-b">{review.comment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


        </div>
    );
};

export default DetailOrderView
