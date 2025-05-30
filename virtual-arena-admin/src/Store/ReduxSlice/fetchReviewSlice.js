import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all reviews for a specific entity
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async ({ entity_type, entity_id }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/admin/reviews/${entity_type}/${entity_id}`,
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
        }
    }
);

// Reviews slice
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch reviews';
            });
    },
});

export default reviewsSlice.reducer;