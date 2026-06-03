import API from "../../api/axios";

export const createJournalAPI = async (data: { content: string; mood: string }) => {
  const response = await API.post("/api/journals", data);
  return response.data;
};

export const getJournalsAPI = async () => {
  const response = await API.get("/journals");
  return response.data;
};

export const analyzeJournalAPI = async (journalId: string) => {
  const response = await API.post("/api/ai/analyze", { journalId });
  return response.data;
};

export const updateJournalAPI = async (
  journalId: string,
  data: { title?: string; content?: string; mood?: string }
) => {
  const response = await API.put(`/api/journals/${journalId}`, data);
  return response.data;
};

export const deleteJournalAPI = async (journalId: string) => {
  const response = await API.delete(`/api/journals/${journalId}`);
  return response.data;
};