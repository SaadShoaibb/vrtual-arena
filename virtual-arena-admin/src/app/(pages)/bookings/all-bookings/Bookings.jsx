'use client';
export const dynamic = 'force-dynamic';

import DynamicTable from '@/components/common/Table';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditBookingForm from './EditBookingForm';
import DetailView from '@/components/Detail';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPusherInstance } from '@/utils/pusher';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sidebarMode, setSidebarMode] = useState('view');
  const [selectedRow, setSelectedRow] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const columns = [
    { header: 'Machine Type', accessor: 'machine_type' },
    { header: 'Start Time', accessor: 'startTime' },
    { header: 'End Time', accessor: 'endTime' },
    { header: 'Customer Name', accessor: 'user_name' },
    { header: 'Email', accessor: 'user_email' },
    {
      header: 'Type',
      accessor: 'booking_type',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'Guest'
            ? 'bg-purple-100 text-purple-800 border border-purple-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {value === 'Guest' ? '👤 Guest' : '🔐 User'}
        </span>
      )
    },
    { header: 'Session Status', accessor: 'session_status' },
    { header: 'Payment Status', accessor: 'status' },
  ];

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return (
      date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ` ${date.toISOString().split('T')[0]}`
    );
  };

  const data = bookings.map((booking) => ({
    machine_type: booking.machine_type,
    booking_id: booking.booking_id,
    start_time: booking.start_time,
    startTime: formatDateTime(booking.start_time),
    endTime: formatDateTime(booking.end_time),
    end_time: booking.end_time,
    user_name: booking.user_name,
    user_email: booking.user_email,
    booking_type: booking.is_guest_booking ? 'Guest' : 'Registered User',
    status: booking.payment_status,
    session_status: booking.session_status,
    payment_status: booking.payment_status,
    payment_method: booking.payment_method,
    is_guest_booking: booking.is_guest_booking,
    booking_reference: booking.booking_reference,
  }));

  const handleFetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/get-Bookings/`, getAuthHeaders());
      setBookings(response?.data?.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchBookings();
  }, []);

  useEffect(() => {
    const pusher = getPusherInstance();
    const channel = pusher.subscribe('my-channel');

    channel.bind('my-event', () => {
      handleFetchBookings();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleSave = async (updatedBooking) => {
    const formatToMySQLDateTime = (dateTimeLocal) => {
      if (!dateTimeLocal) return '';
      const date = new Date(dateTimeLocal);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const payload = {
      machine_type: updatedBooking.machine_type,
      start_time: formatToMySQLDateTime(updatedBooking.start_time),
      end_time: formatToMySQLDateTime(updatedBooking.end_time),
      payment_status: updatedBooking.payment_status,
    };

    try {
      const response = await axios.put(
        `${API_URL}/admin/update-booking/${updatedBooking?.booking_id}`,
        payload,
        getAuthHeaders()
      );

      if (response.status === 200) {
        toast.success('Booking Updated');
        handleFetchBookings();
        setSidebarOpen(false);
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/delete-booking/${selectedRow.booking_id}`,
        getAuthHeaders()
      );

      if (response.status === 200) {
        toast.success('Booking Deleted');
        handleFetchBookings();
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteModalOpen(false);
    setDropdownOpen(null);
  };

  const handleEdit = (row) => {
    setSelectedBooking(row);
    setSidebarMode('edit');
    setSidebarOpen(true);
    setDropdownOpen(null);
    router.push(`/bookings/all-bookings?booking_id=${row.booking_id}`);
  };

  const handleDetail = (row) => {
    setSelectedBooking(row);
    setSidebarMode('view');
    setSidebarOpen(true);
    setDropdownOpen(null);
    router.push(`/bookings/all-bookings?booking_id=${row.booking_id}`);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedBooking(null);
    router.push('/bookings/all-bookings');
  };

  useEffect(() => {
    const bookingId = searchParams.get('booking_id');
    if (bookingId) {
      const booking = bookings.find((b) => b.booking_id === parseInt(bookingId));
      if (booking) {
        setSelectedBooking(booking);
        setSidebarOpen(true);
      }
    }
  }, [bookings, searchParams]);

  // Build detailed booking data for sidebar & PDF
  const bookingData = selectedBooking ? [
    { label: 'Booking ID', value: selectedBooking.booking_id },
    { label: 'User Name', value: selectedBooking.user_name },
    { label: 'Session Name', value: selectedBooking.session_name ?? 'N/A' },
    { label: 'Machine Type', value: selectedBooking.machine_type },
    { label: 'Start Time', value: new Date(selectedBooking.start_time).toLocaleString() },
    { label: 'End Time', value: new Date(selectedBooking.end_time).toLocaleString() },
    { label: 'Members', value: selectedBooking.members ?? selectedBooking.people_count ?? selectedBooking.member_count ?? 'N/A' },
    { label: 'Sessions', value: selectedBooking.sessions ?? selectedBooking.sessions_count ?? selectedBooking.session_count ?? selectedBooking.session_qty ?? 'N/A' },
    { label: 'Pass Type', value: selectedBooking.pass_type ?? selectedBooking.pass ?? selectedBooking.passType ?? 'N/A' },
    { label: 'Total Price', value: (() => {
        const price = selectedBooking.price ?? selectedBooking.total_price ?? selectedBooking.final_price ?? selectedBooking.amount;
        return price !== undefined ? `$${price}` : 'N/A';
      })() },
    { label: 'Payment Status', value: selectedBooking.payment_status },
    { label: 'Payment Method', value: selectedBooking.payment_method || 'N/A' },
    { label: 'Booking Type', value: selectedBooking.is_guest_booking ? 'Guest Booking' : 'Registered User' },
    { label: 'Reference', value: selectedBooking.booking_reference || 'N/A' }
  ] : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gradiant">Bookings</h1>
      <DynamicTable
        headers={columns}
        data={data}
        onEdit={handleEdit}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onConfirm={confirmDelete}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 min-h-screen w-1/2 bg-blackish2 border-l border-gray-200 p-6 z-50"
          >
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700 mb-4"
            >
              <span className="min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold">
                &times;
              </span>
            </button>
            {sidebarMode === 'edit' ? (
              <EditBookingForm data={selectedBooking} onSave={handleSave} />
            ) : (
              <DetailView
                data={bookingData}
                title="Booking Details"
                type="VR_SESSION"
                id={selectedBooking?.booking_id}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
