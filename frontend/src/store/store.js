import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/categoriesSlice";
import salesReducer from "../features/sales/salesSlice";
import productsReducer from '../features/products/productsSlice'
import shoppingCartReducer from "../features/shoppingCart/shoppingCartSlice";
import orderReducer from "../features/order/orderSlice";

 const store = configureStore({
  reducer: {
    //categoriesReducer - это reducer из categoriesSlice
    //он обновляет state.categories при экшенах (fetchCategories.pending/fulfilled/... и т.д.)
    categories: categoriesReducer, 
    sales: salesReducer,
    products: productsReducer,
    shoppingCart: shoppingCartReducer,
    order: orderReducer,
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

