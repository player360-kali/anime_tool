import { axiosClient } from "@/lib/axiosClient";
import type { CategoryTypes, JanrTypes } from "@/types/global";

export const getCategory = async (): Promise<{
  success: boolean;
  count: number;
  data: CategoryTypes[];
}> => (await axiosClient.get("/category")).data;

export const getJanr = async (): Promise<{
  success: boolean;
  data: JanrTypes[];
}> => (await axiosClient.get("/category/janr")).data;
