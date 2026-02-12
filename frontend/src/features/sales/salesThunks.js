import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3333";

// fetchSales отправляет GET /products/all
export const fetchSales = createAsyncThunk(
  "sales/fetchAll",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/products/all`);

      // Оставляем только товары со скидкой
      const salesOnly = response.data.filter(
        (product) =>
          product.discont_price !== null &&
          product.discont_price !== undefined &&
          product.discont_price < product.price
      );

      return salesOnly;
    } catch (error) {
      console.error("There was an error fetching sales products!", error);
      throw error; // чтобы thunk ушел в rejected
    }
  }
);

// отправляет POST 
export const sendSaleCoupon = createAsyncThunk(
  "sales/sendCoupon",
  async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/sale/send`, payload);
      return response.data;
    } catch (error) {
      console.error("There was an error sending coupon request!", error);
      throw error;
    }
  }
);
