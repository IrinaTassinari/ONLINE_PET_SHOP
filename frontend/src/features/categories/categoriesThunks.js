import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3333";

//fetchCategories отправляет GET /categories/all
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/all`);
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
      throw error; // чтобы thunk ушел в rejected
    }
  }
);


export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the products!", error);
      throw error; // rejected
    }
  }
);
