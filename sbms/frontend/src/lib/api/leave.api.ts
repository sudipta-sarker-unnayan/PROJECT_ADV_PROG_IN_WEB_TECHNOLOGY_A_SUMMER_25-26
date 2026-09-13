import { api } from "./axios";
import { Leave, LeaveStatus, CreateLeavePayload } from "../types/leave.types";

export async function fetchLeaves(): Promise<Leave[]> {
  const { data } = await api.get<Leave[]>("/leave");
  return data;
}

export async function applyLeave(payload: CreateLeavePayload): Promise<Leave> {
  const { data } = await api.post<Leave>("/leave", payload);
  return data;
}

export async function updateLeaveStatus(
  id: number,
  status: LeaveStatus,
): Promise<Leave> {
  const { data } = await api.patch<Leave>(`/leave/${id}/status`, { status });
  return data;
}

export async function deleteLeave(id: number): Promise<void> {
  await api.delete(`/leave/${id}`);
}
