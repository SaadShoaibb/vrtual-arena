'use client'
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const GiftCards = () => {
    const [formData, setFormData] = useState({
        code: '',
        amount: '',
        // Assuming the admin creates the card
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.amount) {
            toast.error('All fields are required!');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/admin/create`, formData, getAuthHeaders());

            if (response.status === 201) {
                toast.success('Gift Card created successfully!');
                setFormData({
                    code: '',
                    amount: '',
                    created_by: 'admin',
                });
            } else {
                toast.error(response.data.message || 'Error creating Gift Card');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Internal Server Error');
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Create Gift Card</h1>
                <Form onSubmit={handleSubmit}>
                    <FieldContainer label="Card Code" htmlFor="code">
                        <Input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <FieldContainer label="Amount ($)" htmlFor="amount">
                        <Input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <div className="flex items-center justify-between w-full">
                        <button
                            type="submit"
                            className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create Gift Card
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
export default GiftCards