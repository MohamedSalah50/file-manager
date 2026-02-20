import { Router } from "express";
import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  uploadFileService,
  getFilesByProjectService,
  deleteFileService,
  getFileInfoService,
} from "./file.service.js";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { pathValidationMiddleware } from "../../middleware/pathValidator.js";
import upload from "../../config/multer.js";

const fileController = Router();

// Upload File
fileController.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { projectId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = await uploadFileService(
      { file: req.file },
      projectId,
      req.user._id,
    );

    return successResponse({
      res,
      message: "File uploaded successfully",
      status: 201,
      data: { file },
    });
  }),
);

// Get Files by Project
fileController.get(
  "/project/:projectId",
  protect,
  asyncHandler(async (req, res) => {
    const files = await getFilesByProjectService(req.params.projectId);
    return successResponse({
      res,
      message: "Files retrieved successfully",
      data: { files },
    });
  }),
);

// Get File Info
fileController.get(
  "/:fileId",
  protect,
  asyncHandler(async (req, res) => {
    const file = await getFileInfoService(req.params.fileId);
    return successResponse({
      res,
      message: "File info retrieved successfully",
      data: { file },
    });
  }),
);

// Delete File
fileController.delete(
  "/:fileId",
  protect,
  adminOnly,
  pathValidationMiddleware,
  asyncHandler(async (req, res) => {
    const result = await deleteFileService(req.params.fileId);
    return successResponse({
      res,
      message: result.message,
      data: {},
    });
  }),
);

export default fileController;
