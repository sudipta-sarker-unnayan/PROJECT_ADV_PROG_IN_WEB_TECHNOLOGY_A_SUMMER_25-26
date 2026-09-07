export interface UserRole {
  id: number;
  name: "super_admin" | "manager" | "employee" | "client";
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  createdAt: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
}