'use client'
import React, { useState } from 'react';
import Select from '../common/Select';
import Form from '../common/Form';
import FieldContainer from '../common/FieldContainer';
import Input from '../common/Input';
import PaymentModal from '../PaymentForm';
import { useSelector } from 'react-redux';

const CheckoutForm = ({ bookingSummary, onCheckout, handleRedeem, setMode }) => {
 const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(true);
 
 const {userData} = useSelector((state)=>state.userData)
    
    return (
        <>
            <h1 className='text-[50px] font-bold text-white text-center'>Checkout</h1>
            <p className='text-lg text-white mt-2 text-center'>Please enter your payment details</p>

            {/* Booking Summary */}
            <div className='bg-gray-800 p-4 rounded-lg mt-6'>
                <h2 className='text-xl font-semibold mb-4'>Booking Summary</h2>
                <p><strong>Session:</strong> {bookingSummary.machine_type}</p>
                <p><strong>Start Time:</strong> {bookingSummary.start_time}</p>
                <p><strong>End Time:</strong> {bookingSummary.end_time}</p>
                <p><strong>Price:</strong> ${bookingSummary.price}</p>
            </div>
 
                          
                                {isPaymentModalOpen && (
                                    <PaymentModal
                                        isOpen={isPaymentModalOpen}
                                        onClose={() => {
                                            setIsPaymentModalOpen(false);
                                            // If parent provided setMode, go back to previous screen
                                            if (setMode) setMode('DETAIL');
                                        }}
                                        entity={bookingSummary?.session_id}
                                        userId={userData?.user_id}
                                        amount={bookingSummary?.price}
                                        onSuccess={onCheckout}
                                        onRedeemSuccess={handleRedeem}
                                        type="booking"
                                    />
                                )}
                           
                            
        </>
    );
};

export default CheckoutForm;