import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidator = (val: string) => mongoose.Types.ObjectId.isValid(val);

export const createTaskSchema = z.object({
    params: z.object({
        projectId: z.string().refine(objectIdValidator, {
      message: "Invalid Project ID",
    }),
  }),
  body: z.object({
    title: z.string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    
    description: z.string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(1000, "Description must be less than 1000 characters"),

    status: z.enum(["pending", "in-progress", "Done"]).optional(),

    Priority: z.enum(["high", "medium", "low"]).optional(),

    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }),

    assignee: z.string().refine(objectIdValidator, {
      message: "Invalid Assignee User ID",
    }).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    projectId: z.string().refine(objectIdValidator, {
      message: "Invalid Project ID",
    }),
    taskId: z.string().refine(objectIdValidator, {
      message: "Invalid Task ID",
    }),
  }),
  body: z.object({
    title: z.string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters")
      .optional(),
    
    description: z.string()
      .trim()
      .min(5, "Description must be at least 5 characters")
      .max(1000, "Description must be less than 1000 characters")
      .optional(),

    status: z.enum(["pending", "in-progress", "Done"]).optional(),

    Priority: z.enum(["high", "medium", "low"]).optional(),

    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }).optional(),

    assignee: z.string().refine(objectIdValidator, {
      message: "Invalid Assignee User ID",
    }).optional(),
  }).refine(
    (body) => Object.keys(body).length > 0,
    {
      message: "At least one field must be provided for update",
    }
  ),
});

