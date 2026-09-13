import { api } from "./axios";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task.types";

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>("/task");
  return data;
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/task/${id}`);
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>("/task", payload);
  return data;
}

export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const { data } = await api.patch<Task>(`/task/${id}`, payload);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/task/${id}`);
}
