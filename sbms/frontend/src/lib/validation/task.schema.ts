import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  priority: z.enum(["low", "medium", "high"], { message: "Select a priority" }),
  status: z.enum(["todo", "in_progress", "completed"], {
    message: "Select a status",
  }),
  progress: z.coerce.number().int().min(0).max(100),
  startDate: z.string().min(1, "Start date is required"),
  deadline: z.string().min(1, "Deadline is required"),
  employeeId: z.coerce.number({ error: "Please select an employee" }).int().min(1, "Please select an employee"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
