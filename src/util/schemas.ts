import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z
    .string()
    .max(300, "A descrição deve ter no máximo 300 caracteres"),
  date: z.string(),
});
