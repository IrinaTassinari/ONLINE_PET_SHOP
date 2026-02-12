import { createSlice } from "@reduxjs/toolkit";
import { sendOrder } from "./orderThunks";

const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Order failed";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
