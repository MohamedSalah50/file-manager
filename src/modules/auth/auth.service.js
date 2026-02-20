import userModel from "../../db/models/user.model.js";
import jwt from "jsonwebtoken";

export const registerService = async (userData) => {
  const { username, email, password } = userData;

  // Check if user exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create user
  const user = await userModel.create({
    username,
    email,
    password,
    role: "admin",
  });

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginService = async (loginData) => {
  const { email, password } = loginData;

  // Find user with password
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getMeService = async (userId) => {
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
