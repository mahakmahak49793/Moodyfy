import API from "../../api/axios";

export const createJournalAPI = async (data: { content: string; mood: string }) => {
  const response = await API.post("/journals", data);
  return response.data;
};

export const getJournalsAPI = async () => {
  const response = await API.get("/journals");
  return response.data;
};

export const analyzeJournalAPI = async (journalId: string) => {
  const response = await API.post("/ai/analyze", { journalId });
  return response.data;
};

export const updateJournalAPI = async (
  journalId: string,
  data: { title?: string; content?: string; mood?: string }
) => {
  const response = await API.put(`/journals/${journalId}`, data);
  return response.data;
};

export const deleteJournalAPI = async (journalId: string) => {
  const response = await API.delete(`/journals/${journalId}`);
  return response.data;
};