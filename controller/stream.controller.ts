import axios from "axios";
import type { Request, Response } from "express";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export const streamController = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ message: "id required" });

    const response = await axios.get<{ file: string; skip: string }>(
      `https://anibla.uz/stream/${id}`,
      { params: { format: "api" } },
    );

    if (!response.data.file) {
      return res.status(404).json({ message: "File not found" });
    }

    const proxyUrl = `${BASE_URL}/api/proxy?url=${encodeURIComponent(response.data.file)}`;
    return res.status(200).json({
      file: proxyUrl,
      skip: response.data.skip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
