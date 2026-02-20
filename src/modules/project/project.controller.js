import { Router } from "express";
import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
  deleteProjectService,
} from "./project.service.js";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";

const projectController = Router();

// Create Project
projectController.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const project = await createProjectService(req.body, req.user._id);
    return successResponse({
      res,
      message: "Project created successfully",
      status: 201,
      data: { project },
    });
  }),
);

// Get All Projects
projectController.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const projects = await getAllProjectsService();
    return successResponse({
      res,
      message: "Projects retrieved successfully",
      data: { projects },
    });
  }),
);

// Get Project By ID
projectController.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const project = await getProjectByIdService(req.params.id);
    return successResponse({
      res,
      message: "Project retrieved successfully",
      data: { project },
    });
  }),
);

// Delete Project
projectController.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const result = await deleteProjectService(req.params.id);
    return successResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
);

export default projectController;
