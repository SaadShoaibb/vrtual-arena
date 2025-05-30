"use client";
import Checkbox from "@/components/common/Checkbox";
import FieldContainer from "@/components/common/FieldContainer";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import React, { useState, useEffect } from "react";


const EditCardsForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);

    // // Populate form when data changes
    // useEffect(() => {
    //     if (data) {
    //         setFormData({
    //             card_id: data.card_id || "",
    //             code: data.code || "",
    //             amount: data.amount ? data.amount.replace("$", "") : "", // Remove "$" symbol
    //             is_active: data.is_active || false,
    //         });
    //     }
    // }, [data]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, is_active: e.target.checked });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        console.log(formData)
    };
    const statusOptions = [
        { value: '', label: 'Select status' },
        { value: 'active', label: 'active' },
        { value: 'redeemed', label: 'redeemed' },
        { value: 'expired', label: 'expired' }
    ];
    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Card Code */}
                    <FieldContainer label="Card Code" htmlFor="code">
                        <Input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    {/* Amount */}
                    <FieldContainer label="Amount ($)" htmlFor="amount">
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <FieldContainer label="Card Status" htmlFor="status">
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statusOptions}
                                required
                            />
                        </FieldContainer>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Save Changes
            </button>
        </form>
    );
};

export default EditCardsForm;
