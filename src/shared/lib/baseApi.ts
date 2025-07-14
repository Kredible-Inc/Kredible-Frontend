import axios from "axios";

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseApi;

export async function fetchCreditScore(walletAddress: string) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "pk_07ee8046ea464569b4ac1d843dbef4b7";
  const { data } = await baseApi.get(`/score/${walletAddress}`, {
    headers: {
      "x-api-key": apiKey,
    },
  });
  return data;
} 