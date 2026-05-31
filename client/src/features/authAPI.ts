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
    "/auth/register",
    userData
  );

  return response.data;
};

export const loginUserAPI = async (
  userData: LoginData
): Promise<AuthResponse> => {
  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};

export const verifyOTPAPI = async (
  otpData: VerifyOTPData
): Promise<AuthResponse> => {
  const response = await API.post(
    "/auth/verify-otp",
    otpData
  );

  return response.data;
};