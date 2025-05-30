import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showModal: false,
  modes: '',
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.showModal = true
      state.modes = action.payload // Set mode when opening
    },
    closeModal: (state) => {
      state.showModal = false
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
