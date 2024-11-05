// pages/schema/registerSchema.js
import * as z from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  // Agrega confirmación de contraseña si es necesario
});
