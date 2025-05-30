'use client'
import React, { useState } from 'react';
import Select from '../common/Select';
import Form from '../common/Form';
import FieldContainer from '../common/FieldContainer';
import Input from '../common/Input';
import { formatDateTime } from '@/utils/formateDateTime';

const TournamentBookingForm = ({ tournament, onCheckout }) => {
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardExpiry: "",
        cardCVC: "",
        billingName: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingZip: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form data
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC || !formData.billingName) {
            alert("Please fill out all required fields.");
            return;
        }
     const updatedFormData={
        ...formData,
        tournament
     }
        // Process checkout
        onCheckout(updatedFormData);
       
    };
    console.log(tournament)
    return (
        <>
            <h1 className='text-[50px] font-bold text-white text-center'>Checkout</h1>
            <p className='text-lg text-white mt-2 text-center'>Please enter your payment details</p>

            {/* Tournament Summary */}
            <div className='bg-gray-800 p-4 rounded-lg mt-6 text-white'>
                <h2 className='text-xl font-semibold mb-4'>Tournament Summary</h2>
                <p><strong>Tournament Name:</strong> {tournament.name}</p>
                <p><strong>Start Date:</strong> {formatDateTime(tournament?.start_date)}</p>
                <p><strong>End Date:</strong> {formatDateTime(tournament?.end_date)}</p>
                <p><strong>Ticket Price:</strong> ${tournament.ticket_price}</p>
                <p><strong>Status:</strong> {tournament.status}</p>
                <p><strong>Location:</strong> {tournament.city}, {tournament.state}, {tournament.country}</p>
            </div>

            {/* Checkout Form */}
            <Form onSubmit={handleSubmit} className='mt-[51px] w-full max-w-[540px] text-white'>
                {/* Payment Details */}
                <FieldContainer label="Card Number" htmlFor="cardNumber">
                    <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>
                <div className='flex gap-4'>
                    <FieldContainer label="Expiry Date" htmlFor="cardExpiry">
                        <Input
                            type="text"
                            placeholder="MM/YY"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>
                    <FieldContainer label="CVC" htmlFor="cardCVC">
                        <Input
                            type="text"
                            placeholder="CVC"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>
                </div>

                {/* Billing Information */}
                <h2 className='text-xl font-semibold mt-6 mb-4'>Billing Information</h2>
                <FieldContainer label="Full Name" htmlFor="billingName">
                    <Input
                        type="text"
                        placeholder="John Doe"
                        name="billingName"
                        value={formData.billingName}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>
                <FieldContainer label="Address" htmlFor="billingAddress">
                    <Input
                        type="text"
                        placeholder="123 Main St"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>
                <div className='flex gap-4'>
                    <FieldContainer label="City" htmlFor="billingCity">
                        <Input
                            type="text"
                            placeholder="City"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>
                    <FieldContainer label="State" htmlFor="billingState">
                        <Input
                            type="text"
                            placeholder="State"
                            name="billingState"
                            value={formData.billingState}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>
                </div>
                <FieldContainer label="Zip Code" htmlFor="billingZip">
                    <Input
                        type="text"
                        placeholder="12345"
                        name="billingZip"
                        value={formData.billingZip}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                {/* Submit Button */}
                <button
                    className="bg-white text-black w-full p-[14px] text-lg rounded-md font-semibold mt-6"
                    type='submit'
                >
                    Confirm Payment
                </button>
            </Form>
        </>
    );
};

export default TournamentBookingForm;