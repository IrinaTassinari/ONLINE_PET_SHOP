import { createSlice } from "@reduxjs/toolkit";
import { fetchSales } from "./salesThunks";

const initialState = {
  list: [],
  listStatus: "idle",
  listError: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.error.message;
      });
  },
});

export default salesSlice.reducer;
