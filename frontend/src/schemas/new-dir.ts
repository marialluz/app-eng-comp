import { z } from "zod";

export type NewDirFormData = z.infer<typeof newDirSchema>;

export const newDirSchema = z.object({
  subject: z.string().min(1, "Selecione uma disciplina."),
});
