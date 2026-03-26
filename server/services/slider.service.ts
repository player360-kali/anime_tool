import type { Request, Response } from "express";
import axiosClient from "../utils/axiosClient";

export const getSlider = async (_: Request, res: Response) => {
  try {
    const response = await axiosClient.get("/slider/client");
    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};
