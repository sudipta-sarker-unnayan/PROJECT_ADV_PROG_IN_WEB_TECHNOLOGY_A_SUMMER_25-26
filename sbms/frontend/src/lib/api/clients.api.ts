import { api } from "./axios";
import {
  Client,
  PaginatedClients,
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/client.types";
import { User, PaginatedUsers } from "../types/user.types";

type RawClientsResponse =
  | [Client[], number]
  | { data: Client[]; total: number }
  | { data: Client[]; meta: { total: number } };

function normalizeClientsResponse(raw: RawClientsResponse): PaginatedClients {
  if (Array.isArray(raw)) {
    const [data, total] = raw;
    return { data, total };
  }
  if ("total" in raw) {
    return { data: raw.data, total: raw.total };
  }
  return { data: raw.data, total: raw.meta.total };
}

export async function fetchClients(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<PaginatedClients> {
  const { data } = await api.get<RawClientsResponse>("/clients", { params });
  return normalizeClientsResponse(data);
}

export async function fetchClient(id: number): Promise<Client> {
  const { data } = await api.get<Client>(`/clients/${id}`);
  return data;
}

export async function createClient(
  payload: CreateClientPayload,
): Promise<Client> {
  const { data } = await api.post<Client>("/clients", payload);
  return data;
}

export async function updateClient(
  id: number,
  payload: UpdateClientPayload,
): Promise<Client> {
  const { data } = await api.patch<Client>(`/clients/${id}`, payload);
  return data;
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`/clients/${id}`);
}

// Depends on the backend role-filter fix (GET /users?role=client) —
// once that lands, this returns only client-role users that don't
// already have a Client profile attached, for the create-form dropdown.
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

export async function fetchEligibleUsersForClient(): Promise<User[]> {
  const { data } = await api.get<RawUsersResponse>("/users", {
    params: { role: "client", limit: 100 },
  });
  return normalizeUsersResponse(data).data;
}