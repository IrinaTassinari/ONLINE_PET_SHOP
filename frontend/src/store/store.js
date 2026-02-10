import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/categoriesSlice";
import salesReducer from "../features/sales/salesSlice";
import productsReducer from '../features/products/productsSlice'

 const store = configureStore({
  reducer: {
    categories: categoriesReducer, //categoriesReducer - Это reducer из categoriesSlice
    //Он обновляет state.categories при экшенах (fetchCategories.pending/fulfilled/... и т.д.)
    
    sales: salesReducer,
    products: productsReducer,
  },
});
export default store

// Значит state будет таким:
// state = {
//   categories: {
//     list: [],
//     listStatus: "idle",
//     ...
//   }
// }
