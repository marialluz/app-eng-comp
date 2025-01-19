import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(1, "Usuário é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirm_password: z.string().min(1, "Confirmação de senha é obrigatória"),
    is_student: z.boolean(),
    is_teacher: z.boolean(),
    entry_period: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não conferem",
    path: ["confirm_password"],
  })
  .refine((data) => data.is_student || data.is_teacher, {
    message: "Selecione pelo menos um tipo de usuário",
    path: ["is_student"],
  })
  .superRefine((data, ctx) => {
    // Valida entry_period apenas se for estudante
    if (data.is_student && !data.entry_period) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Período de ingresso é obrigatório para alunos",
        path: ["entry_period"],
      });
    }
  });

export type RegisterData = z.infer<typeof registerSchema>;