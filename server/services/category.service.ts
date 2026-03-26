import type { Request, Response } from "express";
import axiosClient from "../utils/axiosClient.ts";

export const getCategories = async (_: Request, res: Response) => {
  try {
    // const response = await axiosClient.get("/category");
    const response = {
      status: 200,
      data: {
        success: true,
        count: 5,
        data: [
          {
            isRestricted: true,
            _id: "653f7b1380692ab4bfe9148f",
            nameuz: "Hamma animelar",
            nameru: "Все аниме",
            createdAt: "2023-10-30T09:44:51.404Z",
            __v: 0,
          },
          {
            isRestricted: true,
            _id: "653f7b3380692ab4bfe91562",
            nameuz: "Ongoing",
            nameru: "Онгоинг",
            createdAt: "2023-10-30T09:45:23.507Z",
            __v: 0,
          },
          {
            isRestricted: true,
            _id: "6540082cc774ed27d6dfa516",
            nameuz: "Yakunlangan Animelar",
            nameru: "Завершенные аниме",
            createdAt: "2023-10-30T19:46:52.924Z",
            __v: 0,
          },
          {
            isRestricted: true,
            _id: "65400859c774ed27d6dfa57d",
            nameuz: "Anime Filmlar",
            nameru: "Аниме фильмы",
            createdAt: "2023-10-30T19:47:37.524Z",
            __v: 0,
          },
          {
            isRestricted: false,
            _id: "6544eb355722b851d0525e1b",
            nameuz: "Amedia Content",
            nameru: "Амедиа Контент",
            createdAt: "2023-11-03T12:44:37.143Z",
            __v: 0,
          },
        ],
      },
    };
    return setTimeout(
      () => res.status(response.status).json(response.data),
      2000,
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
