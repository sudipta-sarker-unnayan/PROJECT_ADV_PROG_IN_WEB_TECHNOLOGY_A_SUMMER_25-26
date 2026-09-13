import { Employee } from "./employee.types";

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Leave {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  employee: Employee;
}

export interface CreateLeavePayload {
  reason: string;
  startDate: string;
  endDate: string;
  employeeId: number;
}
