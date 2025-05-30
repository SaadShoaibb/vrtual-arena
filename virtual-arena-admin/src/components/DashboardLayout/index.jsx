'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SidebarDropdown from '../SidebarDropdown';
import { MdOutlineDashboard } from "react-icons/md";
import { SiSession } from "react-icons/si";
import { TbBrandBooking, TbTournament } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { FaBars, FaBell, FaGift } from 'react-icons/fa';
import { FaUsers } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './Notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '@/Store/ReduxSlice/notificationSlice';
import { BsCurrencyDollar } from "react-icons/bs";

const DashboardLayout = ({ children, pageTitle }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarPosition, setSidebarPosition] = useState('relative');
    const pathname = usePathname();
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notifications);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || user?.role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleNotifications = () => {
        setNotificationsOpen(!isNotificationsOpen);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen(!isProfileOpen);
        setNotificationsOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                const width = window.innerWidth;
                setSidebarOpen(width >= 768);
                setSidebarPosition(width < 768 ? 'absolute' : 'relative');
            }
        };

        if (typeof window !== 'undefined') {
            handleResize();
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <div className="flex min-h-screen bg-blackish">
            {/* Sidebar */}
            <div
                className={`min-h-screen h-full text-white ${isSidebarOpen ? 'w-64' : 'w-16'} transition-width duration-300`}
                style={{
                    position: sidebarPosition,
                    zIndex: 50,
                    height: '100vh',
                    left: '0px',
                }}
            >
                <div className="p-4 absolute top-1 -right-10">
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isSidebarOpen ? (
                            <span className='h-10 w-10 bg-grad rounded-full text-white flex justify-center items-center'>
                                <IoMdClose size={20} />
                            </span>
                        ) : (
                            <span className='h-10 w-10 bg-grad rounded-full text-white flex justify-center items-center'>
                                <FaBars size={20} />
                            </span>
                        )}
                    </button>
                </div>
                <img
                    src="/assets/logo.png"
                    className={`my-4 mx-auto h-16 w-auto ${isSidebarOpen ? "" : "opacity-0"}`}
                    alt="logo"
                />
                <nav>
                    <ul>
                        <li className="p-4">
                            <Link href="/dashboard" className={`flex items-center ${pathname === '/dashboard' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <MdOutlineDashboard className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Dashboard"}
                                </div>
                            </Link>
                        </li>

                        <SidebarDropdown
                            isSidebarOpen={isSidebarOpen}
                            title="Session"
                            icon={<SiSession className='text-[#926BB9]' size={20} />}
                            items={[
                                { label: "Add Session", href: "/sessions/add-session" },
                                { label: "All Sessions", href: "/sessions/all-sessions" },
                            ]}
                            dropdownId="session"
                        />

                        <li className="p-4">
                            <Link href="/bookings/all-bookings" className={`flex items-center ${pathname === '/bookings/all-bookings' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <TbBrandBooking className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Bookings"}
                                </div>
                            </Link>
                        </li>

                        <SidebarDropdown
                            isSidebarOpen={isSidebarOpen}
                            title="Tournaments"
                            icon={<TbTournament className='text-[#926BB9]' size={24} />}
                            items={[
                                { label: "Add Tournament", href: "/tournaments/add-tournament" },
                                { label: "All Tournaments", href: "/tournaments/all-tournaments" },
                                { label: "Registrations", href: "/tournaments/registrations" },
                            ]}
                            dropdownId="tournament"
                        />

                        <SidebarDropdown
                            isSidebarOpen={isSidebarOpen}
                            title="Products"
                            icon={<TbTournament className='text-[#926BB9]' size={24} />}
                            items={[
                                { label: "Add Product", href: "/products/add-product" },
                                { label: "All Products", href: "/products/all-products" },
                            ]}
                            dropdownId="products"
                        />

                        <SidebarDropdown
                            isSidebarOpen={isSidebarOpen}
                            title="Gift Cards"
                            icon={<FaGift className='text-[#926BB9]' size={24} />}
                            items={[
                                { label: "Add Cards", href: "/gift-cards/add-cards" },
                                { label: "All Cards", href: "/gift-cards/all-cards" },
                            ]}
                            dropdownId="cards"
                        />

                        <li className="p-4">
                            <Link href="/orders" className={`flex items-center ${pathname === '/orders' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <LuClipboardList className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Orders"}
                                </div>
                            </Link>
                        </li>

                        <li className="p-4">
                            <Link href="/payments" className={`flex items-center ${pathname === '/payments' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <BsCurrencyDollar className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Payments"}
                                </div>
                            </Link>
                        </li>

                        <li className="p-4">
                            <Link href="/users" className={`flex items-center ${pathname === '/users' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <FaUsers className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Users"}
                                </div>
                            </Link>
                        </li>

                        <li className="p-4">
                            <Link href="/notifications" className={`flex items-center ${pathname === '/notifications' ? "text-gradiant font-bold" : ""}`}>
                                <div className='flex items-center gap-2 leading-none'>
                                    <FaBell className='text-[#926BB9]' size={20} />
                                    {isSidebarOpen && "Notifications"}{" "}
                                    <span className='text-red-500'>
                                        {notifications?.some((n) => !n.is_read) &&
                                            `${notifications.filter((n) => !n.is_read).length}`}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className={`flex-1 border-l border-gray1 overflow-x-hidden relative`}>
                <div className='h-20 pl-10 pr-4 flex justify-between items-center'>
                    <h1 className='text-white font-bold text-[16px] md:text-xl'>{pageTitle}</h1>
                    <div className='flex items-center gap-4'>
                        <NotificationDropdown />
                        <div className="relative">
                            <button onClick={toggleProfile} className="flex items-center gap-1 focus:outline-none">
                                <img src="/assets/logo.png" className='h-9 w-9 rounded-full' alt="Profile" />
                                <h1 className='text-white font-semibold'>Admin</h1>
                            </button>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg"
                                    >
                                        <div className="p-4">
                                            <Link href="/profile" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded">
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block text-sm text-red-600 hover:bg-gray-100 p-2 rounded w-full text-left"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-4 py-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
