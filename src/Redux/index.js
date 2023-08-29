import { configureStore } from '@reduxjs/toolkit'
import productSlice from './productSlice'
import formSlice from './formSlice'


export const store = configureStore({
  reducer: {
    product: productSlice,
    form: formSlice, 
   
  },

})