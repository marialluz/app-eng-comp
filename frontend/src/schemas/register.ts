import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "O nome de usuário é obrigatório.")
      .max(100, "O nome de usuário deve ter no máximo 100 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirm_password: z
      .string()
      .min(6, "A confirmação da senha deve ter no mínimo 6 caracteres."),
    is_student: z.boolean(),
    is_teacher: z.boolean(),
    entry_period: z
      .string()
      .regex(
        /^\d{4}\.[12]$/,
        "O período de ingresso deve estar no formato YYYY.S, onde S é 1 ou 2."
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas não coincidem.",
  })
  .refine((data) => !(data.is_student && data.is_teacher), {
    message: "Um usuário não pode ser estudante e professor ao mesmo tempo.",
    path: ["is_student"],
  })
  .superRefine((data, ctx) => {
    if (data.is_student && !data.entry_period) {
      ctx.addIssue({
        code: "custom",
        path: ["entry_period"],
        message: "O período de ingresso é obrigatório para estudantes.",
      });
    }

    if (data.is_teacher && data.entry_period) {
      ctx.addIssue({
        code: "custom",
        path: ["entry_period"],
        message: "Professores não podem fornecer um período de entrada.",
      });
    }
  });

export type RegisterData = z.infer<typeof registerSchema>;
