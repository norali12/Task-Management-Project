import { Response, Request } from "express";
import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "../services/tasks.services.js";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId } = req.params as { projectId: string };
    
    const { title, description, status, Priority,  dueDate, assignee } = req.body;

    const task = await createTaskService(
      projectId,
      {
        title,
        description,
        status,
        Priority,
        dueDate,
        assignee,
      },
      userId
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId } = req.params as { projectId: string };

    const status = req.query.status as "pending" | "in-progress" | "Done" | undefined;
    const Priority = req.query.Priority as "high" | "medium" | "low" | undefined;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllTasksService(projectId, userId, { status, Priority }, page, limit);

    return res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId, taskId } = req.params as { projectId: string; taskId: string };

    const task = await getTaskByIdService(projectId, taskId, userId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId, taskId } = req.params as { projectId: string; taskId: string };

    const { title, description, status, Priority, dueDate, assignee } = req.body;

    const updatedTask = await updateTaskService(
      projectId,
      taskId,
      userId,
      {
        title,
        description,
        status,
        Priority,
        dueDate,
        assignee,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId, taskId } = req.params as { projectId: string; taskId: string };

    await deleteTaskService(projectId, taskId, userId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
