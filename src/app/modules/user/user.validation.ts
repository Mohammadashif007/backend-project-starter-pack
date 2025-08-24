import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name too short, minimum 2 character required" })
        .max(50, { message: "Name max 50 character" }),

    email: z
        .email({ message: "Invalid email address format" })
        .min(2, { message: "Email must be minimum 2 characters" })
        .max(50, { message: "Email can not exceed 100 characters" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
        .regex(/[@$!%*?&#]/, {
            message:
                "Password must contain at least one special character (@, $, !, %, *, ?, &)",
        })
        .optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
            message:
                "Phone number must be a valid Bangladeshi number (e.g. +8801XXXXXXXXX or 01XXXXXXXXX)",
        })
        .optional(),
    address: z.string().optional(),
});

export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name too short, minimum 2 character required" })
        .max(50, { message: "Name max 50 character" })
        .optional(),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number",
        })
        .regex(/[@$!%*?&]/, {
            message:
                "Password must contain at least one special character (@, $, !, %, *, ?, &)",
        })
        .optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
            message:
                "Phone number must be a valid Bangladeshi number (e.g. +8801XXXXXXXXX or 01XXXXXXXXX)",
        })
        .optional(),
    address: z.string().optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isVerified: z.boolean().optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z.boolean().optional(),
});