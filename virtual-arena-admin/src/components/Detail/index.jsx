"use client";
import { fetchReviews } from '@/Store/ReduxSlice/fetchReviewSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DetailView = ({ data, title, type,id }) => {
    console.log(data)
    const dispatch = useDispatch();
    const { reviews, loading, error } = useSelector((state) => state.reviews);
    const entity_id = id
    const entity_type = type
    useEffect(() => {
        if (entity_type) {

            dispatch(fetchReviews({ entity_type, entity_id }));
        }
    }, [dispatch, entity_type, entity_id]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <div className="text-white">
            <h2 className="text-xl font-bold mb-4 text-gradiant">{title}</h2>
            {data?.map((item, index) => (
                <p
                    key={index}
                    className="flex justify-between items-center border-b border-gray-600 py-2"
                >
                    <strong>{item?.label}:</strong> {item?.value}
                </p>
            ))}

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

export default DetailView;