import { api } from "./axios";
import {
  Employee,
  PaginatedEmployees,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../types/employee.types";
import { User, PaginatedUsers } from "../types/user.types";

type RawEmployeesResponse =
  | [Employee[], number]
  | { data: Employee[]; total: number }
  | { data: Employee[]; meta: { total: number } };

function normalizeEmployeesResponse(
  raw: RawEmployeesResponse,
): PaginatedEmployees {
  if (Array.isArray(raw)) {
    const [data, total] = raw;
    return { data, total };
  }
  if ("total" in raw) {
    return { data: raw.data, total: raw.total };
  }
  return { data: raw.data, total: raw.meta.total };
}

export async function fetchEmployees(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<PaginatedEmployees> {
  const { data } = await api.get<RawEmployeesResponse>("/employees", {
    params,
  });
  return normalizeEmployeesResponse(data);
}

export async function fetchEmployee(id: number): Promise<Employee> {
  const { data } = await api.get<Employee>(`/employees/${id}`);
  return data;
}

export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<Employee> {
  const { data } = await api.post<Employee>("/employees", payload);
  return data;
}

export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
): Promise<Employee> {
  const { data } = await api.patch<Employee>(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`);
}

// Depends on the backend role-filter fix (GET /users?role=employee) —
// returns employee-role users for the create-form User dropdown.
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

export async function fetchEligibleUsersForEmployee(): Promise<User[]> {
  const { data } = await api.get<RawUsersResponse>("/users", {
    params: { role: "employee", limit: 100 },
  });
  return normalizeUsersResponse(data).data;
}

// Manager-candidate list for the Manager dropdown — every existing
// employee is shown as a candidate (kept simple, per the plan).
export async function fetchManagerCandidates(): Promise<Employee[]> {
  const res = await fetchEmployees({ page: 1, limit: 100 });
  return res.data;
}