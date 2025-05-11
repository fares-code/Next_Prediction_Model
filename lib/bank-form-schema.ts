import { z } from "zod";

export const bankFormSchema = z.object({
  age: z.number().min(18).max(100),
  duration: z.number().min(0),
  campaign: z.number().min(0),
  previous: z.number().min(0),
});

export type BankFormType = z.infer<typeof bankFormSchema>;
