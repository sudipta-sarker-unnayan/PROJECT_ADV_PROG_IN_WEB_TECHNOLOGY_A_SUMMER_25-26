import { api } from "./axios";
import {
  Department,
  PaginatedDepartments,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "../types/department.types";

type RawDepartmentsResponse =
  | [Department[], number]
  | { data: Department[]; total: number }
  | { data: Department[]; meta: { total: number } };

function normalizeDepartmentsResponse(
  raw: RawDepartmentsResponse,
): PaginatedDepartments {
  if (Array.isArray(raw)) {
    const [data, total] = raw;
    return { data, total };
  }
  if ("total" in raw) {
    return { data: raw.data, total: raw.total };
  }
  return { data: raw.data, total: raw.meta.total };
}

export async function fetchDepartments(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<PaginatedDepartments> {
  const { data } = await api.get<RawDepartmentsResponse>("/departments", {
    params,
  });
  return normalizeDepartmentsResponse(data);
}

export async function fetchDepartment(id: number): Promise<Department> {
  const { data } = await api.get<Department>(`/departments/${id}`);
  return data;
}

export async function createDepartment(
  payload: CreateDepartmentPayload,
): Promise<Department> {
  const { data } = await api.post<Department>("/departments", payload);
  return data;
}

export async function updateDepartment(
  id: number,
  payload: UpdateDepartmentPayload,
): Promise<Department> {
  const { data } = await api.patch<Department>(`/departments/${id}`, payload);
  return data;
}

export async function deleteDepartment(id: number): Promise<void> {
  await api.delete(`/departments/${id}`);
}