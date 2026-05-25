import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Le nom est trop court" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  ville: z.string().min(2, 'Ville requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string(),
  region: z.string(),
  stock: z.number().int().nonnegative(),
  image: z.string().url().optional(),
  
});
