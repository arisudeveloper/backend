"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.createUserLoginSchema = exports.createUserRegisterSchema = void 0;
const zod_1 = require("zod");
exports.createUserRegisterSchema = zod_1.z
    .object({
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    email: zod_1.z.email(),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    company: zod_1.z.string().optional(),
    country: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    mice: zod_1.z.boolean(),
    fit: zod_1.z.boolean(),
    groups: zod_1.z.boolean(),
    guaranteed: zod_1.z.boolean(),
    leisure: zod_1.z.boolean(),
    policy: zod_1.z.boolean(),
})
    .strict();
exports.createUserLoginSchema = zod_1.z
    .object({
    email: zod_1.z.email(),
    password: zod_1.z.string(),
})
    .strict();
exports.forgotPasswordSchema = zod_1.z
    .object({
    email: zod_1.z.email(),
})
    .strict();
exports.resetPasswordSchema = zod_1.z
    .object({
    newpassword: zod_1.z.string(),
})
    .strict();
exports.deleteAccountSchema = zod_1.z
    .object({
    email: zod_1.z.string(),
})
    .strict();
