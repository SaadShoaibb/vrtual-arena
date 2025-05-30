"use client";
import DynamicTable from '@/components/common/Table';
import OrderTable from '@/components/common/Table/OrderTable';
import DetailView from '@/components/Detail';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DetailOrderView from './DetailOrderView';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence,motion } from 'framer-motion';
import pusher from '@/utils/pusher';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/Store/ReduxSlice/orderSlice';

const Orders = ({orders}) => {
    // Table columns
    const columns = [
        { header: 'Order ID', accessor: 'order_id' },
        { header: 'Total Amount', accessor: 'total_amount' },
        { header: 'Status', accessor: 'status' },
        { header: 'Payment Status', accessor: 'payment_status' },
        { header: 'Method', accessor: 'payment_method' },
        { header: 'Order Date', accessor: 'created_at' },
        { header: 'User', accessor: 'user_name' },
        { header: 'Items', accessor: 'items_count' },
    ];
    
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')
    // State for orders
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [selectedFilter, setSelectedFilter] = useState('all');
    // Transform orders data for the table
    const data = filteredOrders?.map((order) => ({
        order_id: order.order_id,
        total_amount: `$${order.total_amount}`,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        created_at: new Date(order.created_at).toLocaleDateString(),
        user_name: order.user.name,
        user_email: order.user.email,
        items_count: order.items.length,
        items: order.items, // Store items for detail view
    }));

    // State for sidebar and selected order
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit
    const [dropdownOpen, setDropdownOpen] = useState(null);
   

    

    // Filter options
    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
    ];

    // Handle filter change
    const handleFilterChange = (e) => {
        const status = e.target.value;
        setSelectedFilter(status);

        if (status === 'all') {
            setFilteredOrders(orders); // Show all orders
        } else {
            const filtered = orders.filter((order) => order.status === status);
            setFilteredOrders(filtered); // Filter by status
        }
    };

    

    useEffect(() => {
        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
        //   console.log('New order notification:', data);
        handleFetchOrders();
        //   alert(`New order created: ${data.message}`);/
        });
    
        // Cleanup
        return () => {
          pusher.unsubscribe('my-channel');
        };
      }, []);
    // Initialize filteredOrders with all orders when the component mounts
    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);
    // Handle detail view action
    const handleDetail = (row) => {
        setSelectedOrder(row);
        setSidebarOpen(true);
        setDropdownOpen(null);
        router.push(`/orders?order_id=${row?.order_id}`)
    };
    const handleStatusChange = async (row, status) => {
        console.log('Change Status:', row.order_id, status);
        try {
            const response = await axios.put(`${API_URL}/admin/orders/${row.order_id}/status`, { status }, getAuthHeaders())
            console.log(response)
            if (response.status === 200) {
                toast.success("Status Updated")

                handleFetchOrders();



            }
        } catch (error) {
            console.log(error)
        }
        setDropdownOpen(null)
        // Call API to update status
    };
    // console.log(filteredOrders)
    const handleClosesidebar = () => {
        setSidebarOpen(false)
        router.push(`/orders`)
    }
    // Check URL query on component mount
        useEffect(() => {
            const orderId = searchParams.get('order_id');
            if (orderId) {
                const booking = orders?.find((b) => b.order_id === parseInt(orderId));
                if (booking) {
                    setSelectedOrder(booking);
                    setSidebarOpen(true);
                }
            }
        }, [orders, searchParams]);
    return (
        <div className="p-6">
            <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold mb-6 text-gradiant">Orders</h1>
                {/* Filter Menu */}
                <div className="relative">
                    <select
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="block appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            <OrderTable
                headers={columns}
                data={data}
                onDetail={handleDetail}
                onConfirmStatusChange={handleStatusChange}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                statusModalOpen={statusModalOpen}
                setStatusModalOpen={setStatusModalOpen}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
            />

            {/* Sidebar with Framer Motion */}
            <AnimatePresence>

            {sidebarOpen && (
                <div className="fixed right-0 top-0 min-h-screen overflow-y-auto w-1/2">
                    <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-screen overflow-y-auto w-1/2 bg-blackish2 border-l border-gray-200 p-6 z-50"
                        >
                        <button
                            onClick={handleClosesidebar}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className="min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold">
                                &times;
                            </span>
                        </button>
                        <DetailOrderView data={selectedOrder} />
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;