// ============================================
// SCHEMA: authSchema — Semana 08
// Validación Zod compartida por Login y Registro (React Hook Form)
// ============================================

import { z } from 'zod';

const usernameField = z
  .string()
  .trim()
  .min(2, 'El usuario debe tener al menos 2 caracteres.')
  .max(50, 'El usuario no puede superar 50 caracteres.')
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    'Usa solo letras, números, punto, guion o guion bajo.'
  );

const passwordField = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres.')
  .max(100, 'La contraseña no puede superar 100 caracteres.');

export const loginSchema = z.object({
  username: usernameField,
  password: passwordField,
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(50, 'El nombre no puede superar 50 caracteres.'),
    lastName: z
      .string()
      .trim()
      .min(2, 'El apellido debe tener al menos 2 caracteres.')
      .max(50, 'El apellido no puede superar 50 caracteres.'),
    username: usernameField,
    email: z
      .string()
      .trim()
      .email('Ingresa un correo electrónico válido.')
      .toLowerCase(),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
