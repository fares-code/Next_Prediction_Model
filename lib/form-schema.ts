import { z } from "zod";

export const healthFormSchema = z.object({
  HighBP: z.enum(["1", "0"]),
  HighChol: z.enum(["1", "0"]),
  CholCheck: z.enum(["1", "0"]),
  BMI: z.number().min(10).max(60),
  Smoker: z.enum(["1", "0"]),
  Stroke: z.enum(["1", "0"]),
  HeartDiseaseorAttack: z.enum(["1", "0"]),
  PhysActivity: z.enum(["1", "0"]),
  Fruits: z.enum(["1", "0"]),
  Veggies: z.enum(["1", "0"]),
  HvyAlcholConsump: z.enum(["1", "0"]),
  AnyHealthcare: z.enum(["1", "0"]),
  NoDocbcCost: z.enum(["1", "0"]),
  DiffWalk: z.enum(["1", "0"]),
  Sex: z.enum(["0", "1"]),
  Age: z.number().min(1).max(13),
  Education: z.enum(["1", "2", "3", "4", "5"]),
  Income: z.enum(["1", "2", "3", "4", "5"]),
  GenHlth: z.enum(["1", "2", "3", "4", "5"]),
  MentHlth: z.number().min(0).max(30),
  PhysHlth: z.number().min(0).max(30),
});

export type HealthFormType = z.infer<typeof healthFormSchema>;
