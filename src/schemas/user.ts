import { z } from 'zod';

export const createUserRegisterSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.email(),
    username: z.string(),
    password: z.string(),
    company: z.string().optional(),
    country: z.string(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    mice: z.boolean(),
    fit: z.boolean(),
    groups: z.boolean(),
    guaranteed: z.boolean(),
    leisure: z.boolean(),
    policy: z.boolean(),
  })
  .strict();

export const createUserLoginSchema = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.email(),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    newpassword: z.string(),
  })
  .strict();

export const deleteAccountSchema = z
  .object({
    email: z.string(),
  })
  .strict();
