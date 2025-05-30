import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async () => {
        const response = await axios.get(`${API_URL}/user/notifications`, getAuthHeaders());
        return response.data.notifications;
    }
);

// Async Thunk for marking a single notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markNotificationAsRead',
    async (notificationId) => {
        const response = await axios.put(
            `${API_URL}/user/notification/${notificationId}/read`,
            {},
            getAuthHeaders()
        );
        return response.data;
    }
);

// Async Thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllNotificationsAsRead',
    async () => {
        const response = await axios.put(
            `${API_URL}/user/notifications/read-all`,
            {},
            getAuthHeaders()
        );
        return response.data;
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
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
                state.error = action.error.message;
            })

            // Mark Single Notification as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notificationId = action.meta.arg;
                state.notifications = state.notifications.map((n) =>
                    n.notification_id === notificationId ? { ...n, is_read: true } : n
                );
            })

            // Mark All Notifications as Read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({ ...n, is_read: true }));
            });
    },
});

export default notificationSlice.reducer;