import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";

export interface TaskData {
  title: string;
  description: string;
  status?: "pending" | "in-progress" | "Done";
  Priority?: "high" | "medium" | "low";
  dueDate: string | Date;
  assignee?: string ;  
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "Done";
  Priority?: "high" | "medium" | "low";
  dueDate?: string | Date;
  assignee?: string;
}

export const createTaskService = async (projectId: string, data: TaskData, userId: string) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new Error("Project not found or you are not authorized to add tasks to it");
  }

  const task = await Task.create({
    title: data.title,
    description: data.description,
    status: data.status || "pending",
    project: projectId,
    Priority: data.Priority || "medium",
    dueDate: new Date(data.dueDate),
    assignee: data.assignee || null,
  });

  project.tasks.push(task._id as mongoose.Types.ObjectId);
  await project.save();

  return task;
};

export const getAllTasksService = async (projectId: string, userId: string,  
  filters: {
    status?: "pending" | "in-progress" | "Done";
    Priority?: "high" | "medium" | "low";
  },
  page: number = 1,
  limit: number = 10
) => {

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new Error("Project not found or not owned by you");
  }

  const query = { 
    project: projectId,
    ...(filters.status && { status: filters.status }),
    ...(filters.Priority && { Priority: filters.Priority }),
  };

  const skip = (page - 1) * limit;

  const [tasks, totalTasks] = await Promise.all([
    Task.find(query)
      .populate("project", "title")
      .populate("assignee", "Name Email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(query)
  ]);

  return {
    tasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalResults: totalTasks,
    },
  };
};

export const getTaskByIdService = async (projectId: string, taskId: string, userId: string) => {
 if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid ID ");
  }
 const projectExists = await Project.findOne({ _id: projectId, owner: userId }).select("_id");

  if (!projectExists) {
    throw new Error("Unauthorized to access this project or project not found");
  }
  
  const task = await Task.findOne({ _id: taskId, project: projectId })
    .populate("project", "title status") 
    .populate("assignee", "Name Email"); 

  if (!task) {
    throw new Error("Task not found in this project");
  }
  return task;
};

export const updateTaskService = async (
  projectId: string,
  taskId: string,
  userId: string,
  data: UpdateTaskData
) => {

  const [projectExists, taskExists] = await Promise.all([
    Project.findOne({ _id: projectId, owner: userId }).select("_id"),
    Task.findOne({ _id: taskId, project: projectId }).select("_id")
  ]);
  if (!projectExists) {
    throw new Error("Unauthorized to update tasks in this project or project not found");
  }
  if (!taskExists) {
    throw new Error("Task not found in this project");
  }

  const { title, description, status, Priority, dueDate, assignee } = data;
  
  const updatePayload = {
  ...(title !== undefined && { title }),
  ...(description !== undefined && { description }),
  ...(status !== undefined && { status }),
  ...(Priority !== undefined && { Priority }),
  ...(assignee !== undefined && { assignee }),
  ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
};

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    updatePayload,
    { returnDocument: "after", runValidators: true }
  ).populate("project", "title").populate("assignee", "Name Email");

  return updatedTask;
};

export const deleteTaskService = async (projectId: string, taskId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid ID ");
  }
  const [projectExists, taskExists] = await Promise.all([
    Project.findOne({ _id: projectId, owner: userId }).select("_id"),
    Task.findOne({ _id: taskId, project: projectId }).select("_id")
  ]);
  if (!projectExists) {
    throw new Error("Unauthorized to delete tasks in this project or project not found");
  }
  if (!taskExists) {
    throw new Error("Task not found in this project");
  }

  await Promise.all([
    Task.findByIdAndDelete(taskId),
    Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } })
  ]);

  return;
};
