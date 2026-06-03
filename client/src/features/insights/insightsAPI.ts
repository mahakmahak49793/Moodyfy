import API from "../../api/axios";
import type { AIInsight } from "./insightsTypes";

// POST /ai/analyze — sends journalId, gets back a fresh insight
export const analyzeJournalAPI = async (
  journalId: string,
): Promise<{ success: boolean; insight: AIInsight }> => {
  const response = await API.post("/ai/analyze", { journalId });
  return response.data;
};
