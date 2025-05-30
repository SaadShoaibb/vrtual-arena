import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openDropdownId: null, // Track which dropdown is open
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    toggleDropdown: (state, action) => {
      const { dropdownId } = action.payload;
      if (state.openDropdownId === dropdownId) {
        // If the clicked dropdown is already open, close it
        state.openDropdownId = null;
      } else {
        // Otherwise, open the clicked dropdown
        state.openDropdownId = dropdownId;
      }
    },
    closeDropdown: (state) => {
      state.openDropdownId = null; // Close all dropdowns
    },
  },
});

export const { toggleDropdown, closeDropdown } = dropdownSlice.actions;

export default dropdownSlice.reducer;