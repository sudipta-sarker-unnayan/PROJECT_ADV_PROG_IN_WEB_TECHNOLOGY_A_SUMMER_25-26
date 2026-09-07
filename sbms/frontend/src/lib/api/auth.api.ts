import { api } from "./axios";
import { LoginPayload, LoginResponse } from "@/lib/types/auth.types";

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}
export async function changePasswordRequest(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.patch("/auth/change-password", payload);
  return res.data;
}