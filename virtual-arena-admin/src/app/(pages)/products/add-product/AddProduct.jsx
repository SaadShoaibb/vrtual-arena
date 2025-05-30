'use client'
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { API_URL, getFormDataAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        original_price: "",
        discount_price: "",
        stock: "",
        color: "",
        size: "",
        discount: "",
        shipping_info: "",
        images: [], // To store selected image files
        is_active:true
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };

            // Calculate discount price if original_price or discount changes
            if (name === "original_price" || name === "discount") {
                const originalPrice = parseFloat(updatedData.original_price) || 0;
                const discountPercentage = parseFloat(updatedData.discount) || 0;

                if (discountPercentage > 0) {
                    const discountAmount = (originalPrice * discountPercentage) / 100;
                    updatedData.discount_price = (originalPrice - discountAmount).toFixed(2);
                } else {
                    updatedData.discount_price = originalPrice.toFixed(2);
                }
            }

            return updatedData;
        });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // Allow up to 5 files
        setFormData({ ...formData, images: files });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        const validationErrors = {};
        if (!formData.name) validationErrors.name = "Name is required";
        if (!formData.description) validationErrors.description = "Description is required";
        if (!formData.original_price) validationErrors.original_price = "Original price is required";
        if (!formData.stock) validationErrors.stock = "Stock is required";
        if (formData.images.length === 0) validationErrors.images = "At least one image is required";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Create FormData object for file upload
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("original_price", formData.original_price);
        data.append("discount_price", formData.discount_price);
        data.append("stock", formData.stock);
        data.append("color", formData.color);
        data.append("size", formData.size);
        data.append("discount", formData.discount);
        data.append("shipping_info", formData.shipping_info);
        formData.images.forEach((image) => {
            data.append("images", image); // Append each image file
        });

        try {
            // Submit form data to the backend
            const response = await axios.post(`${API_URL}/admin/add-products`, data, getFormDataAuthHeaders());

            if (response.status === 201) {
                toast.success("Product added successfully!");
                // Reset form after successful submission
                setFormData({
                    name: "",
                    description: "",
                    original_price: "",
                    discount_price: "",
                    stock: "",
                    color: "",
                    size: "",
                    discount: "",
                    shipping_info: "",
                    images: [],
                });
                setErrors({});
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product. Please try again.");
        }
    };

    const shipingOptions = [
        { value: '', label: 'Select shipping options' },
        { value: '1-3', label: '1-3 days' },
        { value: '3-7', label: '3-7 days' },
        { value: '7-9', label: '7-9 days' },
        { value: '8-15', label: '8-15 days' },
        { value: '9-21', label: '9-21 days' },
    ];

    return (
        <div className="flex items-center justify-center">
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Create New Session</h1>
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Name */}
                        <FieldContainer label="Product Name" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder={'Priduct Title'}
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                        </FieldContainer>

                        {/* Description */}
                        <FieldContainer label="Description" htmlFor="description">
                            <Input
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder={'Product Description'}
                            />
                            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                        </FieldContainer>

                        {/* Original Price */}
                        <FieldContainer label="Original Price" htmlFor="original_price">
                            <Input
                                type="number"
                                step="0.01"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleChange}
                                required
                                placeholder="Original Price"
                            />
                            {errors.original_price && <span className="text-red-500 text-sm">{errors.original_price}</span>}
                        </FieldContainer>

                        {/* Discount Percentage */}
                        <FieldContainer label="Discount %" htmlFor="discount">
                            <Input
                                type="number"
                                step="0.01"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="Discount Percentage"
                            />
                            {errors.discount && <span className="text-red-500 text-sm">{errors.discount}</span>}
                        </FieldContainer>

                        {/* Discount Price */}
                        <FieldContainer label="Discount Price" htmlFor="discount_price">
                            <Input
                                type="number"
                                step="0.01"
                                name="discount_price"
                                value={formData.discount_price}
                                onChange={handleChange}
                                disabled
                                placeholder="Discount Price"
                            />
                            {errors.discount_price && <span className="text-red-500 text-sm">{errors.discount_price}</span>}
                        </FieldContainer>


                        {/* Stock */}
                        <FieldContainer label="Stock" htmlFor="stock">
                            <Input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                placeholder={'Product Stock'}
                            />
                            {errors.stock && <span className="text-red-500 text-sm">{errors.stock}</span>}
                        </FieldContainer>

                        {/* Color */}
                        <FieldContainer label="Color" htmlFor="color">
                            <Input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder={'Color'}
                            />
                            {errors.color && <span className="text-red-500 text-sm">{errors.color}</span>}
                        </FieldContainer>

                        {/* Size */}
                        <FieldContainer label="Size" htmlFor="size">
                            <Input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder={'Size'}
                            />
                            {errors.size && <span className="text-red-500 text-sm">{errors.size}</span>}
                        </FieldContainer>
                        {/* Shipping days */}
                        <FieldContainer label="Shipping Days" htmlFor="shipping_info">
                            <Select
                                name="shipping_info"
                                value={formData.shipping_info}
                                onChange={handleChange}
                                options={shipingOptions}
                                required
                            />
                        </FieldContainer>
                        {/* Image Upload */}
                        <FieldContainer label="Images (up to 5)" htmlFor="images">
                            <Input
                                type="file"
                                name="images"
                                onChange={handleImageChange}
                                multiple // Allow multiple files
                                accept="image/*" // Accept only image files
                                required
                            />
                            {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}
                        </FieldContainer>

                        {/* Active Status */}
                    <Checkbox
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        label="Active"
                    />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between w-full mt-6">
                        <button
                            type="submit"
                            className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Product
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default AddProduct
