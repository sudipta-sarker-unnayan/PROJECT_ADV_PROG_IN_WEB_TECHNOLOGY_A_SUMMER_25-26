import { api } from "./axios";
import {
  User,
  PaginatedUsers,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user.types";

type RawUsersResponse =
  | [User[], number]
  | { data: User[]; total: number }
  | { data: User[]; meta: { total: number } };

function normalizeUsersResponse(raw: RawUsersResponse): PaginatedUsers {
  if (Array.isArray(raw)) {
    const [data, total] = raw;
    return { data, total };
  }
  if ("total" in raw) {
    return { data: raw.data, total: raw.total };
  }
  return { data: raw.data, total: raw.meta.total };
}

export async function fetchUsers(params: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}): Promise<PaginatedUsers> {
  const { data } = await api.get<RawUsersResponse>("/users", { params });
  return normalizeUsersResponse(data);
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
