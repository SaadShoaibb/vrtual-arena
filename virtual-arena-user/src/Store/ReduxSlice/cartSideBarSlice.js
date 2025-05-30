import { createSlice } from "@reduxjs/toolkit";

const cartSidebarSlice = createSlice({
  name: "cartSidebar",
  initialState: {
    isOpen: false, // Sidebar is closed by default
  },
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openSidebar, closeSidebar } = cartSidebarSlice.actions;
export default cartSidebarSlice.reducer;