export enum RoleName {
  SUPER_ADMIN = "super_admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
  CLIENT = "client",
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: RoleName;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}