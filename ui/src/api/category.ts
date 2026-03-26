import { axiosClient } from "@/lib/axiosClient";
import type { CategoryTypes } from "@/types/global";

export const getCategory = async (): Promise<{
  success: boolean;
  count: number;
  data: CategoryTypes[];
}> => (await axiosClient.get("/category")).data;
