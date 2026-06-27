import Project from "../models/project.model.js";
import mongoose from "mongoose";

interface ProjectData {
        title: string;
        description: string;
        status: "active" | "completed" ;
    }
interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: "active" | "completed" ;
}

export const createProjectService = async(     
    data: ProjectData,
    userId:string
)=>{
    
    const project = await Project.create({
        title : data.title,
        description : data.description,
        status : data.status || "active",
        owner:userId
    });


    return project;
}

export const getAllProjectsService = async(
    userId:string,    
    page: number = 1, 
    limit: number = 10
)=>{

    const skip = (page - 1) * limit;

    const projects = await Project.find({owner:userId})
    .sort({ createdAt: -1 }) 
    .skip(skip)      
    .limit(limit);

    const totalProjects = await Project.countDocuments({ owner: userId });



    return {
        projects,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalProjects / limit),
            totalResults: totalProjects
        }
     };
}

export const getAProjectByIdService = async(
    projectId:string,
    userId:string
)=>{

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID"); 
    }

     const project = await Project.findOne({ _id: projectId,owner: userId });
    if (!project) {
        throw new Error("Project not found");
    }

    return project;
    
}

export const updateProjectService = async(
    projectId:string,
    userId:string,
    data:UpdateProjectData
)=>{
    const {title,description,status}=data;

    const updatePayload:UpdateProjectData={};

    if (title) updatePayload.title = title;
    if (description) updatePayload.description = description;
    if (status) updatePayload.status = status;

    const project=await Project.findOneAndUpdate(
        {_id:projectId,owner:userId},
        updatePayload,
        {returnDocument: 'after',runValidators:true});

    if(!project){

    throw new Error("Project not found");

    }

return project;

};
 
export const deleteProjectService  =async(
    projectId:string,
    userId:string
)=>{
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID"); 
    }

     const project = await Project.findOneAndDelete({ _id: projectId,owner: userId });
    if (!project) {
        throw new Error("Project not found");
    }

    return;
}