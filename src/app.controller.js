import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join("./src/config/.env.dev") });

import express from "express";
import cors from "cors";
import authController from "./modules/auth/auth.controller.js";
import projectController from "./modules/project/project.controller.js";
import fileController from "./modules/file/file.controller.js";
import connectDb from "./db/connection.db.js";
import { globalErrorHandling } from "./utils/response.js";
const port = process.env.PORT || 3000;
const app = express();

async function bootstrap() {
  app.use(express.json());
  app.use(cors());

  //db
  await connectDb();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  //routes
  app.use("/auth", authController);
  app.use("/projects", projectController);
  app.use("/files", fileController);

  app.all("{/*dummy}", (req, res) => {
    res.status(404).json({ message: "in-valid app routing" });
  });

  //error handler
  app.use(globalErrorHandling);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📁 CDN Path: ${process.env.CDN_PATH}`);
    console.log(`🌐 Base URL: ${process.env.BASE_URL}`);
  });
}

export default bootstrap;
