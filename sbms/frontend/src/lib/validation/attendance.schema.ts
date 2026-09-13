import { z } from "zod";

export const attendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  checkIn: z.string().min(1, "Check-in time is required"),
  checkOut: z.string().optional(),
  status: z.enum(["present", "absent", "late"]).optional(),
  employeeId: z.coerce.number({ error: "Please select an employee" }).int().min(1, "Please select an employee"),
});

export type AttendanceFormValues = z.infer<typeof attendanceSchema>;
