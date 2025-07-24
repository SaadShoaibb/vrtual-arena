'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/Store/ReduxSlice/notificationSlice';
import { getPusherInstance, cleanupPusher } from '@/utils/pusher';


const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.notifications);
    const dropdownRef = useRef(null); // Ref for the dropdown menu

    useEffect(() => {
        try {
            const pusher = getPusherInstance();
            if (pusher) {
                const channel = pusher.subscribe('my-channel');
                
                channel.bind('my-event', (data) => {
                    dispatch(fetchNotifications());
                });
            
                // Cleanup
                return () => {
                    if (channel) {
                        channel.unbind_all();
                        channel.unsubscribe();
                    }
                };
            }
        } catch (error) {
            console.error("Pusher error:", error);
        }
    }, [dispatch]);

    // Fetch notifications when the dropdown is opened
    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    // Handle click outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener when the dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            console.log('Attempting to mark notification as read:', notificationId);

            // Debug: Check if token exists
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);
            console.log('Token length:', token ? token.length : 0);

            await dispatch(markNotificationAsRead(notificationId)).unwrap();
            console.log('Successfully marked notification as read');
        } catch (error) {
            console.error("Error marking notification as read:", error);
            console.error("Error type:", typeof error);
            console.error("Error message:", error.message || error);

            // Show user-friendly error message
            alert('Failed to mark notification as read. Please try again.');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            console.log('Attempting to mark all notifications as read');
            await dispatch(markAllNotificationsAsRead()).unwrap();
            console.log('Successfully marked all notifications as read');
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            // Show user-friendly error message
            alert('Failed to mark all notifications as read. Please try again.');
        }
    };

    // Count unread notifications
    const unreadCount = notifications?.filter(notification => !notification.is_read)?.length || 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white focus:outline-none"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                    >
                        <div className="p-4 bg-gray-100 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Notifications</h3>
                                {notifications?.length > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Loading...</div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-500">
                                    {typeof error === 'string' ? error : 'Failed to load notifications'}
                                </div>
                            ) : notifications?.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.notification_id}
                                        className={`p-4 border-b hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.title || 'New Notification'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {notification.message || 'You have a new notification'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.notification_id)}
                                                    className="text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">No notifications</div>
                            )}
                        </div>

                        <div className="p-2 bg-gray-100 border-t text-center">
                            <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                                View all notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;