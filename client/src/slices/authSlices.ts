// import { createSlice } from "@reduxjs/toolkit";

// interface AuthState {
//   user: null | {
//     name: string;
//     email: string;
//   };
//   token: string | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//     },

//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { loginSuccess, logout } = authSlice.actions;
// export default authSlice.reducer;