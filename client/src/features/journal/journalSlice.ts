import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { AIInsight, Journal } from "./journalTypes";
import { analyzeJournalAPI, createJournalAPI, getJournalsAPI } from "./journalAPI";



interface JournalState {
  journals: Journal[];
  insight: AIInsight | null;
  loading: boolean;
}

const initialState: JournalState = {
  journals: [],
  insight: null,
  loading: false,
};

export const createJournal =
  createAsyncThunk(
    "journal/create",

    async (
      data: {
        title:string,
        content: string;
        mood: string;
      }
    ) => {
      return await createJournalAPI(
        data
      );
    }
  );

export const getJournals =
  createAsyncThunk(
    "journal/getAll",

    async () => {
      return await getJournalsAPI();
    }
  );

export const analyzeJournal =
  createAsyncThunk(
    "journal/analyze",

    async (journalId: string) => {
      return await analyzeJournalAPI(
        journalId
      );
    }
  );

const journalSlice = createSlice({
  name: "journal",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(
        createJournal.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        createJournal.fulfilled,
        (state, action) => {
          state.loading = false;

          state.journals.unshift(
            action.payload.journal
          );
        }
      )

      // GET
      .addCase(
        getJournals.fulfilled,
        (state, action) => {
          state.journals =
            action.payload.journals;
        }
      )

      // AI
      .addCase(
        analyzeJournal.fulfilled,
        (state, action) => {
          state.insight =
            action.payload.insight;
        }
      );
  },
});

export default journalSlice.reducer; 