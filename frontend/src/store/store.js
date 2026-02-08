import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "../features/categories/categoriesSlice";

 const store = configureStore({
  reducer: {
    categories: categoriesReducer, //categoriesReducer - Это reducer из categoriesSlice
    //Он обновляет state.categories при экшенах (fetchCategories.pending/fulfilled/... и т.д.)
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
