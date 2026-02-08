import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchCategoryById } from "./categoriesThunks";

// slice в ReduxToolKit:
// - хранит initialState
// - описывает, как state меняется на actions (reducers, extraReducers)
// - отдает reducer для store
const initialState = {
  // для списка категорий
  //  list - это список категорий
  list: [],
  listStatus: "idle",
  listError: null,

  //для одной категории + ее товаров
  current: null, // страницa одной конкретной категории. null = пока не загружено.
  currentProducts: [], //Здесь хранятся товары этой выбранной категории.
  currentStatus: "idle", //Статус запроса одной категории: "idle": еще не запрашивали
  //"loading": идет загрузка
  // "succeeded": успешно
  // "failed": ошибка
  currentError: null, //Текст ошибки, если запрос одной категории упал
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        // fetchTodos.pending - объект действия = action
        // pending вызывается автоматически, когда fetchTodos только отправлен. Это проиходит сразу после dispatch(fetchTodos())
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.error.message;
      })

      .addCase(fetchCategoryById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current =
          action.payload && action.payload.category
            ? action.payload.category
            : null;
        state.currentProducts =
          action.payload && action.payload.data ? action.payload.data : [];
      })

      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
