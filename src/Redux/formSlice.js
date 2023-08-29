// src/redux/formSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formSubmission: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormSubmission: (state, action) => {
      state.formSubmission = action.payload;
    },
  },
});

export const { setFormSubmission } = formSlice.actions;

export default formSlice.reducer;
