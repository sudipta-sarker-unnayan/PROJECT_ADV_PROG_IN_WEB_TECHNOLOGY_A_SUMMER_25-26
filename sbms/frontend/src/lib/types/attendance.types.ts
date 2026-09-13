import { Employee } from "./employee.types";

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
}

export interface Attendance {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: AttendanceStatus;
  employee: Employee;
}

export interface CreateAttendancePayload {
  date: string;
  checkIn: string;
  checkOut?: string;
  status?: `${AttendanceStatus}`;
  employeeId: number;
}
