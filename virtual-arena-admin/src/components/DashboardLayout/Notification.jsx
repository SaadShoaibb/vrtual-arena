'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/Store/ReduxSlice/notificationSlice';
import pusher from '@/utils/pusher';


const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.notifications);
    const dropdownRef = useRef(null); // Ref for the dropdown menu
    useEffect(() => {
        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
        //   console.log('New order notification:', data);
          dispatch(fetchNotifications());
        //   alert(`New order created: ${data.message}`);/
        });
    
        // Cleanup
        return () => {
          pusher.unsubscribe('my-channel');
        };
      }, []);
    // Fetch notifications when the dropdown is opened
    useEffect(() => {
            dispatch(fetchNotifications());
    }, [ dispatch]);

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
        dispatch(markNotificationAsRead(notificationId));
    };

    const handleMarkAllAsRead = async () => {
        dispatch(markAllNotificationsAsRead());
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const visibleNotifications = notifications.slice(0, 6);
    const hasMore = notifications.length > 6;

    return (
        <div className='relative'>
            {/* Notification Bell Icon */}
            <div className='relative cursor-pointer' onClick={toggleDropdown}>
    <FaBell size={24} className="text-white" />
    {notifications.some((n) => n.is_read === 0) && (
        <span className='absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex justify-center items-center'>
            {notifications.filter((n) => n.is_read === 0).length}
        </span>
    )}
</div>


            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef} // Attach the ref to the dropdown
                        className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className='py-2'>
                            {/* Mark All as Read Button */}
                            <button
                                onClick={handleMarkAllAsRead}
                                className='w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer'
                            >
                                Mark All as Read
                            </button>

                            {/* Notifications List */}
                            {visibleNotifications.map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    className='flex flex-col justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'
                                >
                                    <Link href={notification.link}>
                                        <div onClick={() => setIsOpen(false)} className='flex-1'>
                                            <div className='flex justify-between items-center'>
                                                <p className='text-sm font-medium'>{notification.subject}</p>
                                                <p className='text-sm font-medium'>
                                                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <p className='text-xs text-gray-500'>{notification.message}</p>
                                        </div>
                                    </Link>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.notification_id)}
                                            className='text-xs text-start text-blue-600 hover:underline'
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Show All Button */}
                            {hasMore && (
                                <Link href="/notifications">
                                    <div className='w-full text-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer'>
                                        Show All
                                    </div>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;