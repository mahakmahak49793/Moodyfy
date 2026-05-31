import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { InsightState } from "./insightsTypes";
import { analyzeJournalAPI } from "./insightsAPI";


const initialState: InsightState = {
  insights: [],
  currentInsight: null,
  loading: false,
  error: null,
};

export const analyzeJournal = createAsyncThunk(
  "insight/analyze",
  async (journalId: string, { rejectWithValue }) => {
    try {
      const data = await analyzeJournalAPI(journalId);
      return data.insight;
    } catch (err: any) {
      // surfaces your backend's { message: "..." } to the UI
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to analyze journal"
      );
    }
  }
);

const insightSlice = createSlice({
  name: "insight",
  initialState,
  reducers: {
    clearCurrentInsight(state) {
      state.currentInsight = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInsight = action.payload;
        // also push into history so the insight page can list past analyses
        state.insights.unshift(action.payload);
      })
      .addCase(analyzeJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentInsight, clearError } = insightSlice.actions;
export default insightSlice.reducer;