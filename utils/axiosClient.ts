import axios from "axios";

const BASE_URL = process.env.BASE_URL || "";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API request error:", err.message);
    return Promise.reject(err);
  },
);

export default axiosClient;
