import { api } from "./axios";
import { Attendance, CreateAttendancePayload } from "../types/attendance.types";

export async function fetchAttendance(): Promise<Attendance[]> {
  const { data } = await api.get<Attendance[]>("/attendence");
  return data;
}

export async function createAttendance(
  payload: CreateAttendancePayload,
): Promise<Attendance> {
  const { data } = await api.post<Attendance>("/attendence", payload);
  return data;
}
