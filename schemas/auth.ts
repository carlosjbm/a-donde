import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email()),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email().max(255, "El email no puede exceder 255 caracteres")),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
