import { API_URL } from "@/config/env";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
