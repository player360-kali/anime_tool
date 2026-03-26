import { axiosClient } from "@/lib/axiosClient";
import type { SliderTypes } from "@/types/global";

export const getSliders = async (): Promise<{
  success: boolean;
  data: SliderTypes[];
}> => (await axiosClient.get("/slider")).data;
