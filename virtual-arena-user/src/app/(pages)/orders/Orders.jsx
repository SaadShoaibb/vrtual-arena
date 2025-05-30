'use client';
import AuthModel from '@/app/components/AuthModal';
import { submitReview } from '@/Store/ReduxSlice/reviewSlice';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa'; // For star ratings
import { useSelector } from 'react-redux';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const {userData} = useSelector((state)=>state.userData)
    // const { submitting } = useSelector((state) => state.reviews);
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/orders`, getAuthHeaders());
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRating(0);
        setComment('');
    };

    const handleSubmitReview = () => {
        if (!selectedOrder || rating === 0) {
            alert('Please provide a rating.');
            return;
        }

        dispatch(
            submitReview({
                user_id: userData.user_id,
                entity_type: 'PRODUCT',
                entity_id: selectedOrder.order_id,
                rating,
                comment,
            })
        ).then(() => {
            alert('Review submitted successfully!');
            closeModal();
        }).catch(() => {
            alert('Failed to submit review.');
        });
    };

    return (
        <div className="p-6 bg-blackish text-white">
            <div className="mx-auto container">
                <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-blackish text-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="py-3 px-4 border-b text-left">Order ID</th>
                                    <th className="py-3 px-4 border-b text-left">Total Amount</th>
                                    <th className="py-3 px-4 border-b text-left">Status</th>
                                    <th className="py-3 px-4 border-b text-left">Order Date</th>
                                    <th className="py-3 px-4 border-b text-left">Items</th>
                                    <th className="py-3 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id} className="hover:bg-gray-50 hover:text-black">
                                        <td className="py-3 px-4 border-b">{order.order_id}</td>
                                        <td className="py-3 px-4 border-b">${order.total_amount}</td>
                                        <td className="py-3 px-4 border-b">
                                            <span
                                                className={`px-2 py-1 text-sm rounded-full ${
                                                    order.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : order.status === 'shipped'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <ul className="list-disc list-inside">
                                                {order.items.map((item) => (
                                                    <li key={item.order_item_id} className="text-sm">
                                                        {item.product_name} (Qty: {item.quantity}, Price: ${item.item_price})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            {order.status === 'delivered' && (
                                                <button
                                                    onClick={() => openModal(order)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Leave Feedback
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <AuthModel onClose={()=>setIsModalOpen(false)} >
                        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                        
                        <div className="mb-4">
                            <label className="block mb-2">Rating:</label>
                            <div className="flex">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                    key={index}
                                        className={`cursor-pointer text-2xl ${
                                            index < rating ? 'text-yellow-500' : 'text-gray-500'
                                        }`}
                                        onClick={() => setRating(index + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Comment:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                rows="3"
                            />
                        </div>
                       
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                                >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                Submit
                            </button>
                        </div>
                        </AuthModel>
                   
            )}
        </div>
    );
};

export default Orders;