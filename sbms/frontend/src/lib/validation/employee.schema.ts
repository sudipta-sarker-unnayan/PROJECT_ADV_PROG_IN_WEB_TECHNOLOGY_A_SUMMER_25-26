import { z } from "zod";

export const createEmployeeSchema = z.object({
  userId: z.coerce.number({ required_error: "Please select a user" }).int(),
  departmentId: z.coerce.number().int().optional(),
  managerId: z.coerce.number().int().optional(),
  designation: z.string().optional(),
  salary: z.coerce.number().min(0, "Salary cannot be negative").optional(),
});
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
  departmentId: z.coerce.number().int().optional(),
  managerId: z.coerce.number().int().optional(),
  designation: z.string().optional(),
  salary: z.coerce.number().min(0, "Salary cannot be negative").optional(),
});
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;