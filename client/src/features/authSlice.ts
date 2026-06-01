import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type {
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  registerUserAPI,
  loginUserAPI,
  verifyOTPAPI,
  resendOTPAPI, 
} from "./authAPI";

import type {
  RegisterData,
  LoginData,
  VerifyOTPData,
  AuthResponse,
   ResendOTPData,
} from "./authAPI";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  pendingEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  pendingEmail: null,
};

export const resendOTP = createAsyncThunk<
  AuthResponse,
  ResendOTPData,
  { rejectValue: string }
>(
  "auth/resendOTP",
  async (data, thunkAPI) => {
    try {
      return await resendOTPAPI(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerUserAPI(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await loginUserAPI(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk<
  AuthResponse,
  VerifyOTPData,
  { rejectValue: string }
>(
  "auth/verifyOTP",
  async (otpData, thunkAPI) => {
    try {
      return await verifyOTPAPI(otpData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    }
  }
);



const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    },
  },

extraReducers: (builder) => {
  builder
    // REGISTER
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingEmail = action.meta.arg.email; // 👈 store email from the request arg
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration failed";
    })

    // VERIFY OTP
    .addCase(verifyOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(verifyOTP.fulfilled, (state) => {
      state.loading = false;
      state.pendingEmail = null;
    })
    .addCase(verifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "OTP verification failed";
    })

    // LOGIN (your existing cases stay as-is)
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    })
    .addCase(resendOTP.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(resendOTP.fulfilled, (state) => {
  state.loading = false;
})
.addCase(resendOTP.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to resend OTP";
})
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });
},
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;