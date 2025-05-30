import { API_URL, getAuthHeaders } from "@/utils/ApiUrl";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define API endpoints (Update according to your backend)


// Async thunk to fetch wishlist products
export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/user/wishlist`,getAuthHeaders());
            return res.data.data; // Assuming { success: true, data: [...] }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch wishlist");
        }
    }
);

// Async thunk to add a product to the wishlist
export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_URL}/user/wishlist/${productId}`,
                {},
                getAuthHeaders()
            );
            return productId; // Return product ID to update state
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add to wishlist");
        }
    }
);

// Async thunk to remove a product from the wishlist
export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/user/wishlist/${productId}`, getAuthHeaders());
            return productId; // Return product ID to update state
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to remove from wishlist");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to wishlist
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.wishlist.push(action.payload);
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Remove from wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter(id => id !== action.payload);
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default wishlistSlice.reducer;
