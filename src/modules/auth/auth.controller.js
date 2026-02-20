import { Router } from "express";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { registerService, loginService, getMeService } from "./auth.service.js";
import { protect } from "../../middleware/auth.middleware.js";

const authController = Router();

// Register
authController.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = await registerService(req.body);
    return successResponse({
      res,
      message: "User registered successfully",
      status: 201,
      data: result,
    });
  }),
);

// Login
authController.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = await loginService(req.body);
    return successResponse({
      res,
      message: "Login successful",
      data: result,
    });
  }),
);

// Get Me
authController.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await getMeService(req.user._id);
    return successResponse({
      res,
      message: "User data retrieved",
      data: { user },
    });
  }),
);

export default authController;
