import type { Request, Response } from "express";
import axiosClient from "../utils/axiosClient.ts";
import axios from "axios";

export const searchSeason = async (req: Request, res: Response) => {
  try {
    const response = await axiosClient.get("/season/search", {
      params: {
        text: req.query.search,
      },
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const filterCards = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const filters = {
      category: req.body?.category || [],
      janr: req.body?.janr || [],
      year: req.body?.year || [],
    };

    const response = await axiosClient.post("/season/filter", filters, {
      params: { page, limit },
    });

    const { data, count } = response.data;

    return res.status(response.status).json({
      success: true,
      data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const getSingle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const response = await axiosClient.get("/season/v2/" + id);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export const getStream = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const response = await axios.get<{ file: string; skip: string }>(
      "https://anibla.uz/stream/" + id,
      {
        params: { format: "api" },
      },
    );
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(response.data.file)}`;
    return res.status(response.status).json({
      file: proxyUrl,
      skip: response.data.skip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
