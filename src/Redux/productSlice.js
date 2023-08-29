// src/redux/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductReducer: (state, action) => {
      console.log("setProductReducer payload: ", action.payload);
      state.products = action.payload;
    },

    addProduct: (state, action) => {
      state.products.push(action.payload);
    },

    updateViewCountReducer: (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.imageID === action.payload.imageID
      );

      if (productIndex !== -1) {
        state.products[productIndex].views = action.payload.views;
      }
    },
  },
});

export const { addProduct, setProductReducer,updateViewCountReducer } = productSlice.actions;

export default productSlice.reducer;
