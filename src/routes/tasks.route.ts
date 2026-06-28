import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/tasks.controller.js";

const router = express.Router({mergeParams: true});

router.post("/create", protectedRoute, validate(createTaskSchema), createTaskController);
router.get("/get-all", protectedRoute, getAllTasksController);
router.get("/:taskId", protectedRoute, getTaskByIdController);
router.put("/:taskId", protectedRoute, validate(updateTaskSchema), updateTaskController);
router.delete("/:taskId", protectedRoute, deleteTaskController);

export default router;