import { z } from "zod";

export const leaveSchema = z.object({
  reason: z.string().min(2, "Reason is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  employeeId: z.coerce.number({ error: "Please select an employee" }).int(),
});

export type LeaveFormValues = z.infer<typeof leaveSchema>;
