
import { createSlice} from '@reduxjs/toolkit';
import { fetchUserData } from '../Actions/userActions';



const userSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: null,
    bookings:[],
    registrations:[],
    loadingData: false,
    errorUser: null,
    isAuthenticated:false
  },
  reducers: {
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loadingData = true;
        state.errorUser = null;
        state.isAuthenticated=false
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loadingData = false;
        state.userData = action.payload.user;
        state.bookings = action.payload.sessionIds;
        state.registrations = action.payload.tournamentIds;
        state.isAuthenticated=true
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loadingData = false;
        state.errorUser = action.payload;
        state.isAuthenticated=false
      });
  },
});


export const {clearAuth} =userSlice.actions;


export default userSlice.reducer;