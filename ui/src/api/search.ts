import { axiosClient } from "@/lib/axiosClient";
import type {
  AnimeType,
  CardType,
  CommentType,
  PaginationTypes,
  SearchType,
  SeriaTypes,
} from "@/types/global";

export const search = async (
  name: string,
): Promise<{
  success: boolean;
  data: SearchType[];
}> =>
  (
    await axiosClient.get("/season", {
      params: {
        search: name,
      },
    })
  ).data;

export const filter = async (
  page: number,
  limit: number,
  category?: string[],
  janr?: string[],
  year?: string[],
): Promise<{
  success: boolean;
  data: CardType[];
  pagination: PaginationTypes;
}> =>
  (
    await axiosClient.post(
      "/season/filter",
      { category, janr, year },
      {
        params: {
          page,
          limit,
        },
      },
    )
  ).data;

export const getSingle = async (
  id: string,
): Promise<{
  success: boolean;
  status: number;
  data: AnimeType;
  comment: CommentType[];
  seria: SeriaTypes[];
}> => (await axiosClient.get("/season/single/" + id)).data;

export const getStream = async (
  streamId: string,
): Promise<{ file: string; skip: string }> =>
  (await axiosClient.get("/season/single/stream/" + streamId)).data;
