'use client'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaUsers, FaDollarSign, FaShoppingCart, FaCalendarCheck } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Orders from '../orders/Orders';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/Store/ReduxSlice/orderSlice';

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [orderStats, setOrderStats] = useState([]);
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        handleFetchDashboard();
        handleFetchOrderStats();
    }, []);

    const handleFetchDashboard = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/dashboard/stats`, getAuthHeaders());
            setDashboard(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFetchOrderStats = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/dashboard/orders`, getAuthHeaders());
            if (data.success) {
                const chartData = [
                    { status: "Pending", count: data.data.pending },
                    { status: "Processing", count: data.data.processing },
                    { status: "Shipped", count: data.data.shipped },
                    { status: "Delivered", count: data.data.delivered },
                ];
                setOrderStats(chartData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const downloadDashboardReport = async () => {
        if (typeof window === "undefined") return;

        const html2pdf = (await import('html2pdf.js')).default;

        if (!dashboard) {
            alert("Dashboard data not available!");
            return;
        }

        const reportTemplate = document.createElement('div');
        reportTemplate.innerHTML = `
            <div class="p-6 bg-white text-black">
             <img src='/assets/logo.png' class="w-[179px] md:w-[199px] mb-10" />
                <h1 class="text-2xl font-bold mb-4">Dashboard Report</h1>
                <p><strong>Total Revenue:</strong> $${dashboard.totalRevenue}</p>
                <p><strong>Active Users:</strong> ${dashboard.activeUsers}</p>
                <p><strong>Total Sessions Booked:</strong> ${dashboard.totalSessionsBooked}</p>
                <p><strong>Total Orders Placed:</strong> ${dashboard.totalOrdersPlaced}</p>
                <p class="mt-4 text-sm text-gray-500">Generated on ${new Date().toLocaleString()}</p>
            </div>
        `;
        document.body.appendChild(reportTemplate);

        const options = {
            margin: 10,
            filename: `dashboard_report_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf()
            .from(reportTemplate)
            .set(options)
            .save()
            .then(() => {
                document.body.removeChild(reportTemplate);
            });
    };

    const latestOrders = orders?.slice(-10) || [];

    return (
        <div className='w-full'>
            <button
                onClick={downloadDashboardReport}
                className="bg-grad self-end mb-4 text-white font-bold py-2 px-4 rounded"
            >
                Download Report (PDF)
            </button>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blackish2 shadow-md rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <FaDollarSign className="text-green-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-white text-sm">Total Revenue</p>
                        <h2 className="text-xl text-white font-semibold">${dashboard?.totalRevenue}</h2>
                    </div>
                </div>

                <div className="bg-blackish2 shadow-md rounded-lg px-4 py-8 flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUsers className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-white text-sm">Active Users</p>
                        <h2 className="text-xl text-white font-semibold">{dashboard?.activeUsers}</h2>
                    </div>
                </div>

                <div className="bg-blackish2 shadow-md rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <FaCalendarCheck className="text-purple-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-white text-sm">Sessions Booked</p>
                        <h2 className="text-xl text-white font-semibold">{dashboard?.totalSessionsBooked}</h2>
                    </div>
                </div>

                <div className="bg-blackish2 shadow-md rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <FaShoppingCart className="text-yellow-600 text-2xl" />
                    </div>
                    <div>
                        <p className="text-white text-sm">Total Orders</p>
                        <h2 className="text-xl text-white font-semibold">{dashboard?.totalOrdersPlaced}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-blackish2 mt-6 shadow-md rounded-2xl p-6">
                <h2 className="text-xl text-white font-semibold mb-4">Order Status Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4F46E5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <Orders orders={latestOrders} />
        </div>
    );
};

export default Dashboard;
