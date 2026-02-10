import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3333";

// fetchProducts отправляет GET /products/all
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/products/all`);
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the products!", error);
      throw error; // чтобы thunk ушел в rejected
    }
  }
);
