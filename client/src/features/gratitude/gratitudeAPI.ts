import API from "../../api/axios";
import type { Gratitude } from "./gratitudeTypes";

export const createGratitudeAPI = async (
  text: string
): Promise<{ success: boolean; gratitude: Gratitude }> => {
  const response = await API.post("/gratitude", { text });
  return response.data;
};

export const getGratitudesAPI = async (): Promise<{
  success: boolean;
  count: number;
  gratitudes: Gratitude[];
}> => {
  const response = await API.get("/api/gratitude");
  return response.data;
};

export const deleteGratitudeAPI = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await API.delete(`/api/gratitude/${id}`);
  return response.data;
};

export const updateGratitudeAPI = async (id: string, text: string) => {
  const response = await API.put(`/api/gratitude/${id}`, { text });
  return response.data;
};