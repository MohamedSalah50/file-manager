import path from "node:path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../config/.env.dev") });

import express from "express";
import cors from "cors";
import connectDb from "./db/connection.db.js";
import { globalErrorHandling } from "./utils/response.js";

// Import Controllers
import authController from "./modules/auth/auth.controller.js";
import projectController from "./modules/project/project.controller.js";
import fileController from "./modules/file/file.controller.js";

const port = process.env.PORT || 8001;
const app = express();

async function bootstrap() {
  // Increase payload size for large uploads
  app.use(express.json({ limit: "500mb" }));
  app.use(express.urlencoded({ extended: true, limit: "500mb" }));

  app.use(cors());

  // Database connection
  await connectDb();

  // Health check
  app.get("/", (req, res) => {
    res.json({
      message: "CDN Manager API",
      version: "1.0.0",
      status: "running",
      cdnPath: process.env.CDN_PATH,
      baseUrl: process.env.BASE_URL,
      port: port,
      maxFileSize: `${parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)}MB`,
    });
  });

  // Routes
  app.use("/auth", authController);
  app.use("/projects", projectController);
  app.use("/files", fileController);

  // 404 Handler
  // app.all("*", (req, res) => {
  //   res.status(404).json({
  //     success: false,
  //     message: "Route not found",
  //   });
  // });

  // Global Error Handler
  app.use(globalErrorHandling);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📁 CDN Path: ${process.env.CDN_PATH}`);
    console.log(`🌐 Base URL: ${process.env.BASE_URL}`);
    console.log(
      `📦 Max File Size: ${parseInt(process.env.MAX_FILE_SIZE) / (1024 * 1024)}MB`,
    );
  });
}

export default bootstrap;
