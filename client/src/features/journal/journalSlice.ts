import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AIInsight, Journal } from "./journalTypes";
import {
  analyzeJournalAPI,
  createJournalAPI,
  getJournalsAPI,
  deleteJournalAPI,
  updateJournalAPI,
} from "./journalAPI";

interface JournalState {
  journals: Journal[];
  insight: AIInsight | null;
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  journals: [],
  insight: null,
  loading: false,
  error: null,
};

export const createJournal = createAsyncThunk(
  "journal/create",
  async (data: { title: string; content: string; mood: string }, thunkAPI) => {
    try {
      return await createJournalAPI(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create journal"
      );
    }
  }
);

export const getJournals = createAsyncThunk(
  "journal/getAll",
  async (_, thunkAPI) => {
    try {
      return await getJournalsAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch journals"
      );
    }
  }
);

export const deleteJournal = createAsyncThunk(
  "journal/delete",
  async (id: string, thunkAPI) => {
    try {
      await deleteJournalAPI(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete journal"
      );
    }
  }
);

export const updateJournal = createAsyncThunk(
  "journal/update",
  async (
    { id, title, content, mood }: { id: string; title: string; content: string; mood: string },
    thunkAPI
  ) => {
    try {
      const data = await updateJournalAPI(id, { title, content, mood });
      return data.journal;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update journal"
      );
    }
  }
);

export const analyzeJournal = createAsyncThunk(
  "journal/analyze",
  async (journalId: string, thunkAPI) => {
    try {
      return await analyzeJournalAPI(journalId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to analyze journal"
      );
    }
  }
);

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    clearInsight: (state) => {
      state.insight = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals.unshift(action.payload.journal);
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET ALL
      .addCase(getJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = action.payload.journals;
      })
      .addCase(getJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ remove deleted journal from state immediately
        state.journals = state.journals.filter(
          (j) => j._id !== action.payload
        );
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ replace updated journal in state immediately
        const index = state.journals.findIndex(
          (j) => j._id === action.payload._id
        );
        if (index !== -1) {
          state.journals[index] = action.payload;
        }
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ANALYZE
      .addCase(analyzeJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.insight = action.payload.insight;
      })
      .addCase(analyzeJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearInsight, clearError } = journalSlice.actions;
export default journalSlice.reducer;