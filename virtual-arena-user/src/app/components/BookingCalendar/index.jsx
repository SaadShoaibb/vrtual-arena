'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/utils/ApiUrl';

const BookingCalendar = ({ onTimeSlotSelect, selectedSession }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Generate time slots (9 AM to 9 PM, 1-hour intervals)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            let displayTime = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
            if (hour === 12) displayTime = '12:00 PM';
            slots.push({ time, displayTime, hour });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Fetch booking availability for selected date
    const fetchBookingAvailability = async (date) => {
        setLoading(true);
        try {
            const dateStr = date.toISOString().split('T')[0];
            const response = await axios.get(`${API_URL}/user/booking-availability?date=${dateStr}`);
            
            if (response.data.success) {
                setBookings(response.data.bookings);
                setSessions(response.data.sessions);
            }
        } catch (error) {
            console.error('Error fetching booking availability:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingAvailability(selectedDate);
    }, [selectedDate]);

    // Check if a time slot is available
    const isTimeSlotAvailable = (timeSlot, sessionId) => {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(timeSlot.hour, 0, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(timeSlot.hour + 1, 0, 0, 0);

        // Check if any booking conflicts with this time slot
        const conflictingBooking = bookings.find(booking => {
            if (sessionId && booking.session_id !== sessionId) return false;
            
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            
            return (
                (slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd)
            );
        });

        return !conflictingBooking;
    };

    // Get bookings for a specific time slot
    const getBookingsForTimeSlot = (timeSlot) => {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(timeSlot.hour, 0, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(timeSlot.hour + 1, 0, 0, 0);

        return bookings.filter(booking => {
            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);
            
            return (
                (slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd)
            );
        });
    };

    // Handle time slot selection
    const handleTimeSlotClick = (timeSlot) => {
        if (!isTimeSlotAvailable(timeSlot, selectedSession?.session_id)) {
            return; // Don't allow selection of unavailable slots
        }

        const startTime = new Date(selectedDate);
        startTime.setHours(timeSlot.hour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        if (selectedSession?.duration_minutes) {
            endTime.setMinutes(endTime.getMinutes() + selectedSession.duration_minutes);
        } else {
            endTime.setHours(endTime.getHours() + 1); // Default 1 hour
        }

        setSelectedTimeSlot(timeSlot);
        
        if (onTimeSlotSelect) {
            onTimeSlotSelect({
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                timeSlot: timeSlot
            });
        }
    };

    // Calendar navigation
    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const selectDate = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.getTime() === today.getTime();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isPast = date < today;
            
            days.push({
                date,
                isCurrentMonth,
                isToday,
                isSelected,
                isPast,
                day: date.getDate()
            });
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="bg-blackish2 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
                <FaCalendarAlt className="inline mr-2" />
                Select Date & Time
            </h2>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <FaChevronLeft />
                </button>
                <h3 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-white font-semibold py-2">
                        {day}
                    </div>
                ))}
                
                {calendarDays.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => !day.isPast && selectDate(day.date)}
                        disabled={day.isPast}
                        className={`
                            p-2 text-center rounded-lg transition-all duration-200
                            ${!day.isCurrentMonth ? 'text-gray-600' : ''}
                            ${day.isPast ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-gray-700'}
                            ${day.isToday ? 'bg-blue-600 text-white' : ''}
                            ${day.isSelected ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : ''}
                        `}
                    >
                        {day.day}
                    </button>
                ))}
            </div>

            {/* Time Slots */}
            <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaClock className="mr-2" />
                    Available Time Slots - {selectedDate.toLocaleDateString()}
                </h4>
                
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="mt-2">Loading availability...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {timeSlots.map((timeSlot) => {
                            const isAvailable = isTimeSlotAvailable(timeSlot, selectedSession?.session_id);
                            const slotBookings = getBookingsForTimeSlot(timeSlot);
                            const isSelected = selectedTimeSlot?.time === timeSlot.time;
                            
                            return (
                                <button
                                    key={timeSlot.time}
                                    onClick={() => handleTimeSlotClick(timeSlot)}
                                    disabled={!isAvailable}
                                    className={`
                                        p-3 rounded-lg border transition-all duration-200 text-sm
                                        ${isAvailable 
                                            ? isSelected
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-purple-400 text-white'
                                                : 'border-gray-600 hover:border-purple-400 hover:bg-gray-700'
                                            : 'border-red-500 bg-red-900/20 text-red-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <div className="font-semibold">{timeSlot.displayTime}</div>
                                    {!isAvailable && slotBookings.length > 0 && (
                                        <div className="text-xs mt-1 flex items-center">
                                            <FaUser className="mr-1" />
                                            {slotBookings[0].customer_name || 'Booked'}
                                        </div>
                                    )}
                                    {isAvailable && (
                                        <div className="text-xs mt-1 text-green-400">Available</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;
