import express from "express";

import {validate} from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validations/project.validation.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { createProjectController, deleteProjectController, getAllProjectsController, getAProjectByIdController, updateProjectController } from "../controllers/projects.controller.js";


const router = express.Router();


router.post("/create-project", protectedRoute, validate(createProjectSchema), createProjectController );
router.get("/get-all-my-projects", protectedRoute, getAllProjectsController);
router.get("/:projectId", protectedRoute, getAProjectByIdController );
router.put("/:projectId", protectedRoute, validate(updateProjectSchema), updateProjectController );
router.delete("/:projectId", protectedRoute, deleteProjectController)







export default router;



