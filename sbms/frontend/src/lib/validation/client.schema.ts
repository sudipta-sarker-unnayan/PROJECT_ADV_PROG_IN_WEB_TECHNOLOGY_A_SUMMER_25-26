import { z } from "zod";

export const createClientSchema = z.object({
  userId: z.coerce.number({ required_error: "Please select a user" }).int(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});
export type CreateClientFormValues = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  companyName: z.string().optional(),
  phone: z.string().optional(),
});
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;