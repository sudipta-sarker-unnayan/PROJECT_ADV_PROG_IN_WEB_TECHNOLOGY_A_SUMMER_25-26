import { User } from "./user.types";
import { Department } from "./department.types";

export interface Employee {
  id: number;
  user: User;
  department: Department | null;
  manager: Employee | null;
  designation: string | null;
  salary: number | null;
}

export interface PaginatedEmployees {
  data: Employee[];
  total: number;
}

export interface CreateEmployeePayload {
  userId: number;
  departmentId?: number;
  managerId?: number;
  designation?: string;
  salary?: number;
}

export interface UpdateEmployeePayload {
  departmentId?: number;
  managerId?: number;
  designation?: string;
  salary?: number;
}