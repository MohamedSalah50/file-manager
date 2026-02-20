import fs from "fs";
import path from "path";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);

// Create directory if not exists
const ensureDirectory = async (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error("Error creating directory:", error);
    return false;
  }
};

// Move file from temp to CDN
const moveFileToCDN = async (tempPath, destinationPath) => {
  try {
    await copyFile(tempPath, destinationPath);
    await unlink(tempPath); // Delete temp file
    return true;
  } catch (error) {
    console.error("Error moving file:", error);
    return false;
  }
};

// Delete file
const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Generate public URL
const generatePublicUrl = (projectFolder, fileName) => {
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}${projectFolder}/${fileName}`;
};

export default {
  ensureDirectory,
  moveFileToCDN,
  deleteFile,
  generatePublicUrl,
};
