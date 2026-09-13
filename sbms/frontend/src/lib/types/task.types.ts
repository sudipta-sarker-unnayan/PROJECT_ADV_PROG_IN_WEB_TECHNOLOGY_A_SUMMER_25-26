import { Employee } from "./employee.types";

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  startDate: string;
  deadline: string;
  employee: Employee;
  taskFileName?: string | null;
  taskFilePath?: string | null;
  completedFileName?: string | null;
  completedFilePath?: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: `${TaskPriority}`;
  status: `${TaskStatus}`;
  progress: number;
  startDate: string;
  deadline: string;
  employeeId: number;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
