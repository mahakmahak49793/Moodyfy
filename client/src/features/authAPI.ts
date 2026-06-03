import API from "../api/axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}
export interface ResendOTPData {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export const registerUserAPI = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await API.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};

export const loginUserAPI = async (
  userData: LoginData
): Promise<AuthResponse> => {
  const response = await API.post(
    "/api/auth/login",
    userData
  );

  return response.data;
};

export const verifyOTPAPI = async (
  otpData: VerifyOTPData
): Promise<AuthResponse> => {
  const response = await API.post(
    "/api/auth/verify-otp",
    otpData
  );

  return response.data;
};

export const resendOTPAPI = async (
  data: ResendOTPData
): Promise<AuthResponse> => {
  const response = await API.post("/api/auth/resend-otp", data);
  return response.data;
};