import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import journalReducer
from "../features/journal/journalSlice";
import insightReducer from "../features/insights/insightsSlice";
import gratitudeReducer from "../features/gratitude/gratitudeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    insight: insightReducer,
    gratitude: gratitudeReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;