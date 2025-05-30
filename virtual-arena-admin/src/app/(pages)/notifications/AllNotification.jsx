'use client'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/Store/ReduxSlice/notificationSlice';
import pusher from '@/utils/pusher';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AllNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.notifications);

    useEffect(() => {
                dispatch(fetchNotifications());
        }, [ dispatch]);
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
         const handleMarkAsRead = async (notificationId) => {
                dispatch(markNotificationAsRead(notificationId));
            };
        
            const handleMarkAllAsRead = async () => {
                dispatch(markAllNotificationsAsRead());
            };
  return (
   
      <div className='p-6  text-white'>
                            {/* Mark All as Read Button */}
                            <button
                                onClick={handleMarkAllAsRead}
                                className='w-full text-left px-4 py-2 text-sm text-[#926BB9] hover:font-bold transition-all duration-100  rounded-xl cursor-pointer'
                            >
                                Mark All as Read
                            </button>

                            {/* Notifications List */}
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    className='flex flex-col justify-between hover:scale-[1.02] transition-transform duration-100 px-4 py-2 my-3 rounded-xl bg-grad cursor-pointer'
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
                                            <p className='text-xs -500'>{notification.message}</p>
                                        </div>
                                    </Link>
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.notification_id)}
                                            className='text-xs text-start text-[#2FBCF7] hover:underline'
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}

                           
                        </div>
  
  )
}

export default AllNotifications
