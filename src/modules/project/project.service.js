import projectModel from "../../db/models/project.model.js";
import fileHelper from "../../utils/fileHelper.js";
import path from "path";

export const createProjectService = async (projectData, userId) => {
  const { name, folderName, description } = projectData;

  // Check if folder already exists
  const existingProject = await projectModel.findOne({ folderName });
  if (existingProject) {
    throw new Error("Project folder already exists");
  }

  // Create physical folder
  const cdnPath = process.env.CDN_PATH;
  const projectPath = path.join(cdnPath, folderName);

  const created = await fileHelper.ensureDirectory(projectPath);
  if (!created) {
    throw new Error("Failed to create project directory");
  }

  // Save to database
  const project = await projectModel.create({
    name,
    folderName,
    description,
    createdBy: userId,
  });

  return project;
};

export const getAllProjectsService = async () => {
  const projects = await projectModel
    .find()
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });

  return projects;
};

export const getProjectByIdService = async (projectId) => {
  const project = await projectModel
    .findById(projectId)
    .populate("createdBy", "username email");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const deleteProjectService = async (projectId) => {
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // TODO: Check if project has files before deleting

  await projectModel.findByIdAndDelete(projectId);
  return { message: "Project deleted successfully" };
};
