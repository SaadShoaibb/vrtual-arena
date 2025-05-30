"use client";
import DynamicTable from '@/components/common/Table';
import DetailView from '@/components/Detail';
import { API_URL, getAuthHeaders, getFormDataAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditProductForm from './EditProductForm';

const Products = () => {
    // Table columns
    const columns = [
        { header: 'Product Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { header: 'Original Price', accessor: 'Original_Price' },
        { header: 'Discount Price', accessor: 'Discount_Price' },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Color', accessor: 'color' },
        { header: 'Size', accessor: 'size' },
        { header: 'Shipping Info', accessor: 'shipping_info' },
        { header: 'Status', accessor: 'active' },
    ];

    // State for products
    const [products, setProducts] = useState([]);

    // Transform products data for the table
    const data = products?.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        Original_Price: `$${product.original_price}`,
        Discount_Price: `$${product.discount_price}`,
        original_price: product.original_price,
        discount_price: product.discount_price,
        discount: product.discount,
        stock: product.stock,
        color: product.color,
        size: product.size,
        images: product?.images,
        shipping_info: product?.shipping_info,
        active:`${product?.is_active ? "Active":"Not Active"}`,
        is_active:product?.is_active
    }));

    // State for sidebar and selected product
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit'
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Fetch products from the backend
    const handleFetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/products/`, getAuthHeaders());
            setProducts(response?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleFetchProducts();
    }, []);

    // Handle delete action
    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    // Confirm delete action
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/admin/product/${selectedRow.product_id}`, getAuthHeaders());
            if (response.status === 200) {
                toast.success(`${selectedRow.name} Product Deleted`);
                handleFetchProducts();
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.log(error);
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null);
    };

    // Handle edit action
    const handleEdit = (row) => {
        setSelectedProduct(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    // Handle detail view action
    const handleDetail = (row) => {
        setSelectedProduct(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null);
    };

    // Handle save action (update product)
    const handleSave = async (formData) => {
        try {
            const response = await axios.put(
                `${API_URL}/admin/product/${selectedProduct.product_id}`,
                formData,
                getFormDataAuthHeaders()
            );

            if (response.status === 200) {
                toast.success("Product updated successfully");
                handleFetchProducts(); // Refresh the product list
                setSidebarOpen(false); // Close the sidebar
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product.");
        }
    };

    // Data for detail view
    const productData = [
        { label: "Name", value: selectedProduct?.name },
        { label: "Description", value: selectedProduct?.description },
        { label: "Original Price", value: selectedProduct?.original_price },
        { label: "Discount Price", value: selectedProduct?.discount_price },
        { label: "Stock", value: selectedProduct?.stock },
        { label: "Color", value: selectedProduct?.color },
        { label: "Size", value: selectedProduct?.size },
        { label: "Images", value: selectedProduct?.images },
    ];
    console.log(selectedProduct)
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Products</h1>
            <DynamicTable
                headers={columns}
                data={data}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
                onConfirm={confirmDelete}
                sidebarMode={sidebarMode}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
            />
            {sidebarOpen && (
                <div className='fixed right-0 top-0 min-h-screen w-1/2'>
                    <div className={`w-full absolute right-0 transform transition-transform duration-300 ease-in-out top-0 h-screen bg-blackish2 border-l ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        } border-gray-200 p-6`}>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className='min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold'>&times;</span>
                        </button>
                        {sidebarMode === 'edit' ? (
                            <EditProductForm data={selectedProduct} onSave={handleSave} />
                        ) : (
                            <DetailView data={productData} title='Product Details' />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;