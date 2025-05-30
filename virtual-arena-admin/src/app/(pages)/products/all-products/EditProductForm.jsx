"use client";
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import React, { useState, useEffect } from 'react';

const EditProductForm = ({ data, onSave }) => {
    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        original_price: "",
        discount: "",
        discount_price: "",
        stock: "",
        color: "",
        size: "",
        is_active: false,
        images: [], // To store selected image files
    });
    const [errors, setErrors] = useState({});

    // Populate form data when the `data` prop changes
    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                description: data.description || "",
                original_price: data.original_price || "",
                discount: data.discount || "",
                discount_price: data.discount_price || "",
                stock: data.stock || "",
                color: data.color || "",
                size: data.size || "",
                is_active: data.is_active || true,
                images: [], // Reset images when data changes
            });
        }
    }, [data]);

    // Handle input changes
   // Handle input changes
   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: type === "checkbox" ? checked : value };

        // Validate discount percentage (must be <= 100)
        if (name === "discount" && parseFloat(value) > 100) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                discount: "Discount percentage cannot exceed 100%",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, discount: "" }));
        }

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
     const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form data
        const validationErrors = {};
        if (!formData.name) validationErrors.name = "Name is required";
        if (!formData.description) validationErrors.description = "Description is required";
        if (!formData.original_price) validationErrors.original_price = "Original price is required";
        if (!formData.stock) validationErrors.stock = "Stock is required";
        if (parseFloat(formData.discount) > 100) validationErrors.discount = "Discount percentage cannot exceed 100%";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Create FormData object for file upload
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("original_price", formData.original_price);
        data.append("discount", formData.discount);
        data.append("discount_price", formData.discount_price);
        data.append("stock", formData.stock);
        data.append("color", formData.color);
        data.append("size", formData.size);
        data.append("is_active", formData.is_active);
        formData.images.forEach((image) => {
            data.append("images", image); // Append each image file
        });

        // Call the `onSave` function with the form data
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Name */}
                <FieldContainer label="Product Name" htmlFor="name">
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                {/* Description */}
                <FieldContainer label="Description" htmlFor="description">
                    <Input
                        type="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
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
                </FieldContainer>

                {/* Stock */}
                <FieldContainer label="Stock" htmlFor="stock">
                    <Input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                {/* Color */}
                <FieldContainer label="Color" htmlFor="color">
                    <Input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                {/* Size */}
                <FieldContainer label="Size" htmlFor="size">
                    <Input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                {/* Active Status */}
                    <Checkbox
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        label="Active"
                    />
               

                {/* Image Upload */}
                <FieldContainer label="Images (up to 5)" htmlFor="images">
                    <Input
                        type="file"
                        name="images"
                        onChange={handleImageChange}
                        multiple // Allow multiple files
                        accept="image/*" // Accept only image files
                    />
                </FieldContainer>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between w-full mt-6">
                <button
                    type="submit"
                    className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default EditProductForm;