import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showBookModal: false,
  bookingPrefill: null,
}

const bookModalSlice = createSlice({
  name: 'bookModal',
  initialState,
  reducers: {
    openBookModal: (state, action) => {
      state.showBookModal = true;
      state.bookingPrefill = action.payload || null;
    },
    closeBookModal: (state) => {
      state.showBookModal = false;
      state.bookingPrefill = null;
    },
  },
})

export const { openBookModal, closeBookModal } = bookModalSlice.actions
export default bookModalSlice.reducer
