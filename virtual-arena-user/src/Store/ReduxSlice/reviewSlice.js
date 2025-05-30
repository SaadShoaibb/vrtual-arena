import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Submit review
export const submitReview = createAsyncThunk('reviews/submitReview', async (reviewData, { rejectWithValue }) => {
    try {
        await axios.post(`${API_URL}/user/reviews`, reviewData, getAuthHeaders());
        return reviewData; // Return data for optimistic update
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error submitting review');
    }
});

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        submitting: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitReview.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitReview.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });
    },
});


export default reviewsSlice.reducer;