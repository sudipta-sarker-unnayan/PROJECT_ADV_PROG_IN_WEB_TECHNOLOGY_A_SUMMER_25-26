export interface Department {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface PaginatedDepartments {
  data: Department[];
  total: number;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
}