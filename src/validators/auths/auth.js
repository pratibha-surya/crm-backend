import { z } from "zod";

export const registerSchema = z.object({

    firstName: z.string().min(2),

    lastName: z.string().optional(),

    email: z.email(),

    phone: z.string().min(10).max(15),

    password: z.string().min(6)

});

export const loginSchema = z.object({

    email: z.email(),

    password: z.string().min(6)

});