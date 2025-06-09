import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/admin/notifications`, getAuthHeaders());
            return response.data.notifications || [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
        }
    }
);

// Async Thunk for marking a single notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markNotificationAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/admin/notification/${notificationId}/read`,
                {},
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return rejectWithValue(error.response?.data || 'Failed to mark notification as read');
        }
    }
);

// Async Thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllNotificationsAsRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/admin/notifications/read-all`,
                {},
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return rejectWithValue(error.response?.data || 'Failed to mark all notifications as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearNotificationErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error occurred';
            })

            // Mark Single Notification as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notificationId = action.meta.arg;
                state.notifications = state.notifications.map((n) =>
                    n.notification_id === notificationId ? { ...n, is_read: true } : n
                );
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.error = action.payload || 'Failed to mark notification as read';
            })

            // Mark All Notifications as Read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({ ...n, is_read: true }));
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
                state.error = action.payload || 'Failed to mark all notifications as read';
            });
    },
});

export const { clearNotificationErrors } = notificationSlice.actions;
export default notificationSlice.reducer;