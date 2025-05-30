
import { API_URL, getAuthHeaders } from "@/utils/ApiUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch User Data
export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            //   const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
            const response = await axios.get(`${API_URL}/auth/`, getAuthHeaders());

            return response.data; // The API response (leagues and teams)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);