import { z } from "zod";
import mongoose from "mongoose";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be less than 50 characters"),

    description: z
      .string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description must be less than 500 characters"),

    status: z.enum([
      "active",
      
      "completed"
    ]).optional()
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid Project ID",
    }),
  }),
  body: z.object({
    title: z.string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be less than 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description must be less than 500 characters")
      .optional(),

    status: z.enum([
      "active",
      "completed"
    ]).optional()
  })
});