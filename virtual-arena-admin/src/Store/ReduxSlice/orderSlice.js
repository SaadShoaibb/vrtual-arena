import { API_URL, getAuthHeaders } from "@/utils/ApiUrl";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

  // Replace with actual API URL

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/admin/orders`, getAuthHeaders());
        return response.data.orders; 
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
});

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ordersSlice.reducer;
