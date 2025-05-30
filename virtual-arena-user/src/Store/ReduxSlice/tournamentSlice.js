import { API_URL } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to Fetch Tournaments
export const fetchTournaments = createAsyncThunk(
    'tournaments/fetchTournaments',
    async () => {
        const response = await axios.get(`${API_URL}/user/get-tournaments`); // Replace with your API endpoint
        return response.data.tournaments;
    }
);

// Initial State
const initialState = {
    tournaments: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Slice
const tournamentsSlice = createSlice({
    name: 'tournaments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Tournaments
        builder
            .addCase(fetchTournaments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTournaments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tournaments = action.payload;
            })
            .addCase(fetchTournaments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default tournamentsSlice.reducer;