import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { GratitudeState } from "./gratitudeTypes";
import {
  createGratitudeAPI,
  getGratitudesAPI,
  deleteGratitudeAPI,
  updateGratitudeAPI, // Add this import
} from "./gratitudeAPI";

const initialState: GratitudeState = {
  gratitudes: [],
  loading: false,
  error: null,
};

export const createGratitude = createAsyncThunk(
  "gratitude/create",
  async (text: string, { rejectWithValue }) => {
    try {
      const data = await createGratitudeAPI(text);
      return data.gratitude;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to save gratitude");
    }
  }
);

export const getGratitudes = createAsyncThunk(
  "gratitude/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getGratitudesAPI();
      return data.gratitudes;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to fetch gratitudes");
    }
  }
);

export const deleteGratitude = createAsyncThunk(
  "gratitude/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteGratitudeAPI(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to delete gratitude");
    }
  }
);

// Add updateGratitude thunk
export const updateGratitude = createAsyncThunk(
  "gratitude/update",
  async ({ id, text }: { id: string; text: string }, { rejectWithValue }) => {
    try {
      const data = await updateGratitudeAPI(id, text);
      return data.gratitude;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? "Failed to update gratitude");
    }
  }
);

const gratitudeSlice = createSlice({
  name: "gratitude",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createGratitude.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGratitude.fulfilled, (state, action) => {
        state.loading = false;
        state.gratitudes.unshift(action.payload);
      })
      .addCase(createGratitude.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET
      .addCase(getGratitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGratitudes.fulfilled, (state, action) => {
        state.loading = false;
        state.gratitudes = action.payload;
      })
      .addCase(getGratitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteGratitude.fulfilled, (state, action) => {
        state.gratitudes = state.gratitudes.filter(
          (g) => g._id !== action.payload
        );
      })
      .addCase(deleteGratitude.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateGratitude.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGratitude.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.gratitudes.findIndex(
          (g) => g._id === action.payload._id
        );
        if (index !== -1) {
          state.gratitudes[index] = action.payload; // Replace with updated gratitude
        }
      })
      .addCase(updateGratitude.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = gratitudeSlice.actions;
export default gratitudeSlice.reducer;