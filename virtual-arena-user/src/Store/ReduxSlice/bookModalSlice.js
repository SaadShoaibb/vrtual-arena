import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showBookModal: false,
}

const bookModalSlice = createSlice({
  name: 'bookModal',
  initialState,
  reducers: {
    openBookModal: (state, action) => {
      state.showBookModal = true // Set mode when opening
    },
    closeBookModal: (state) => {
      state.showBookModal = false
    },
  },
})

export const { openBookModal, closeBookModal } = bookModalSlice.actions
export default bookModalSlice.reducer
