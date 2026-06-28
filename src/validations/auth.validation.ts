import {z} from "zod";

export const registerSchema = z.object({
  body: z.object({
  Name: z
    .string()
    .min(3, "Name must be at least 3 chars"),

  Email: z
    .email("Invalid email"),

  Password: z
    .string()
    .min(6, "Password must be at least 6 chars")
  })
})
;

export const loginSchema = z.object({
  body: z.object({
    Email: z.email("Invalid email"),
    Password: z.string().min(6, "Invalid password"),
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    Email: z.email("Invalid email"), 
    otp: z.string().min(3, "OTP is required"),
  }),
});


