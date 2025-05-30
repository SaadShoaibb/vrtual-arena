import { API_URL } from '@/utils/ApiUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to Fetch All Products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await axios.get(`${API_URL}/user/products`);
        return response.data;
    }
);

// Async Thunk to Fetch a Single Product by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId) => {
        const response = await axios.get(`${API_URL}/user/product/${productId}`);
        return response.data;
    }
);

// Initial State
const initialState = {
    products: [],
    singleProduct: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    singleProductStatus: 'idle',
    error: null,
};

// Slice
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch All Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

        // Fetch Single Product by ID
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.singleProductStatus = 'loading';
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.singleProductStatus = 'succeeded';
                state.singleProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.singleProductStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer;
