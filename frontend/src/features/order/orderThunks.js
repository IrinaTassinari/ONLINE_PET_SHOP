import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3333";

// sendOrder отправляет POST /order/send
export const sendOrder = createAsyncThunk(
  "order/send",
  async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/order/send`, payload);
      return response.data;
    } catch (error) {
      console.error("There was an error sending the order!", error);
      throw error; // чтобы thunk ушел в rejected
    }
  }
);


