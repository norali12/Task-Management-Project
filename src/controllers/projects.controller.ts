import { Response, Request } from "express";
import { createProjectService, deleteProjectService, getAllProjectsService, getAProjectByIdService, updateProjectService } from "../services/projects.services.js";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const project = await createProjectService(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {

    console.error("Create project error:", error);
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

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllProjectsService(userId, page, limit);

    return res.status(200).json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get projects error:", error);
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

export const getAProjectByIdController = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const { projectId } = req.params as { projectId: string };
    const project = await getAProjectByIdService(projectId, userId);
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);
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

export const updateProjectController = async (req:Request,res:Response)=>{
try{
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const {projectId}=req.params as {projectId:string}
    const {title,description,status}= req.body as {title?:string,description?:string,status?:string}

const project=await updateProjectService(projectId,userId,{title,description,status:status as "active" | "completed"});

return res.status(200).json({
success:true,
message:"Project updated successfully",
data:project

});
}catch(error){
 console.error("Update project error:", error);
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

export const deleteProjectController = async(req:Request,res:Response)=>{
  try{
    const authReq = req as AuthenticatedRequest;
    const { userId } = authReq.user;
    const {projectId}=req.params as {projectId:string}
    await deleteProjectService(projectId,userId);
    return res.status(200).json({
      success:true,
      message:"Project deleted successfully"
    });
  }catch(error){
    console.error("Delete project error:", error);
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
}
