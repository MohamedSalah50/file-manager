import fileModel from "../../db/models/file.model.js";
import projectModel from "../../db/models/project.model.js";
import fileHelper from "../../utils/fileHelper.js";
import path from "path";
import { validatePath } from "../../middleware/pathValidator.js";

export const uploadFileService = async (fileData, projectId, userId) => {
  const { file } = fileData;

  // Check if project exists
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Build destination path
  const cdnPath = process.env.CDN_PATH;
  const destinationDir = path.join(cdnPath, project.folderName);
  const destinationPath = path.join(destinationDir, file.filename);

  // Ensure directory exists
  await fileHelper.ensureDirectory(destinationDir);

  // Move file from temp to CDN
  const moved = await fileHelper.moveFileToCDN(file.path, destinationPath);
  if (!moved) {
    throw new Error("Failed to move file to CDN");
  }

  // Generate public URL
  const publicUrl = fileHelper.generatePublicUrl(
    project.folderName,
    file.filename,
  );

  // Save to database
  const fileRecord = await fileModel.create({
    originalName: file.originalname,
    fileName: file.filename,
    filePath: destinationPath,
    publicUrl,
    fileSize: file.size,
    mimeType: file.mimetype,
    project: projectId,
    uploadedBy: userId,
  });

  return fileRecord;
};

export const getFilesByProjectService = async (projectId) => {
  const files = await fileModel
    .find({ project: projectId })
    .populate("uploadedBy", "username email")
    .sort({ createdAt: -1 });

  return files;
};

export const deleteFileService = async (fileId) => {
  const file = await fileModel.findById(fileId);
  if (!file) {
    throw new Error("File not found");
  }

  // Validate path
  if (!validatePath(file.filePath)) {
    throw new Error("Invalid file path");
  }

  // Delete physical file
  const deleted = await fileHelper.deleteFile(file.filePath);
  if (!deleted) {
    throw new Error("Failed to delete physical file");
  }

  // Delete from database
  await fileModel.findByIdAndDelete(fileId);

  return { message: "File deleted successfully" };
};

export const getFileInfoService = async (fileId) => {
  const file = await fileModel
    .findById(fileId)
    .populate("project", "name folderName")
    .populate("uploadedBy", "username email");

  if (!file) {
    throw new Error("File not found");
  }

  return file;
};
