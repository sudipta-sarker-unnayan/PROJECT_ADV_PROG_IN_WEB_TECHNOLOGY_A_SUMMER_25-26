import { api } from "./axios";
import {
  User,
  PaginatedUsers,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user.types";

export async function fetchUsers(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<PaginatedUsers> {
  const { data } = await api.get<[User[], number]>("/users", { params });
  return { data: data[0], total: data[1] };
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await api.post<User>("/users", payload);
  return data;
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function activateUser(id: number): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}/activate`);
  return data;
}

export async function deactivateUser(id: number): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}/deactivate`);
  return data;
}

export async function resetUserPassword(
  id: number,
  newPassword: string,
): Promise<void> {
  await api.patch(`/users/${id}/reset-password`, { newPassword });
}