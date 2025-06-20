import { API_URL } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to Fetch All Deals
export const fetchDeals = createAsyncThunk(
    'deals/fetchDeals',
    async () => {
        const response = await axios.get(`${API_URL}/user/deals`);
        return response.data;
    }
);

// Async Thunk to Fetch a Single Deal by ID
export const fetchDealById = createAsyncThunk(
    'deals/fetchDealById',
    async (dealId) => {
        const response = await axios.get(`${API_URL}/user/deal/${dealId}`);
        return response.data;
    }
);

// Initial State
const initialState = {
    deals: [],
    singleDeal: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    singleDealStatus: 'idle',
    error: null,
};

// Slice
const dealsSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch All Deals
        builder
            .addCase(fetchDeals.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDeals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.deals = action.payload;
            })
            .addCase(fetchDeals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

        // Fetch Single Deal by ID
        builder
            .addCase(fetchDealById.pending, (state) => {
                state.singleDealStatus = 'loading';
            })
            .addCase(fetchDealById.fulfilled, (state, action) => {
                state.singleDealStatus = 'succeeded';
                state.singleDeal = action.payload;
            })
            .addCase(fetchDealById.rejected, (state, action) => {
                state.singleDealStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export default dealsSlice.reducer; 