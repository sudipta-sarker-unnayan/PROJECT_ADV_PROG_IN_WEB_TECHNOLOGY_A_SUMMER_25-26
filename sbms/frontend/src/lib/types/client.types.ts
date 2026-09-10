import { User } from "./user.types";

export interface Client {
  id: number;
  user: User;
  companyName: string | null;
  phone: string | null;
}

export interface PaginatedClients {
  data: Client[];
  total: number;
}

export interface CreateClientPayload {
  userId: number;
  companyName?: string;
  phone?: string;
}

export interface UpdateClientPayload {
  companyName?: string;
  phone?: string;
}