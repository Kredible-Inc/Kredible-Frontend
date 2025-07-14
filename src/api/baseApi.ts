import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseApi;
