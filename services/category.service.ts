import type { Request, Response } from "express";
import axiosClient from "../utils/axiosClient.js";

export const getCategories = async (_: Request, res: Response) => {
  try {
    const response = await axiosClient.get("/category");
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
