import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

// Async Thunk: Fetch Cart Items
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/carts`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// Async Thunk: Add Item to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, tournament_id, event_id, quantity, item_type = 'product', payment_option }, { rejectWithValue }) => {
    try {
      // Check for authentication token first
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        return rejectWithValue({ message: 'Authentication required. Please login.' });
      }

      let payload;

      if (item_type === 'tournament') {
        // For tournament items, explicitly omit product_id to avoid sending undefined
        payload = {
          tournament_id,
          quantity,
          item_type,
          payment_option: payment_option || 'online' // Default to online payment if not specified
        };

        // Log the payload for debugging
        console.log('Tournament cart payload:', payload);
      } else if (item_type === 'event') {
        // For event items, explicitly omit product_id to avoid sending undefined
        payload = {
          event_id,
          quantity,
          item_type,
          payment_option: payment_option || 'online' // Default to online payment if not specified
        };

        // Log the payload for debugging
        console.log('Event cart payload:', payload);
      } else {
        payload = { product_id, quantity, item_type };
      }

      const response = await axios.post(
        `${API_URL}/user/cart`,
        payload,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error in addToCart thunk:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        return rejectWithValue(error.response.data || { message: 'Server error' });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        return rejectWithValue({ message: 'Network error. No response received.' });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        return rejectWithValue({ message: error.message || 'Unknown error occurred' });
      }
    }
  }
);

// Initial State
const initialState = {
  cart: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Clears cart items locally
    resetCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart.push(action.payload); // Add new item to cart
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
