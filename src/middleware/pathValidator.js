import path from "path";

export const validatePath = (filePath) => {
  const cdnPath = process.env.CDN_PATH;
  const normalizedPath = path.normalize(filePath);
  const resolvedPath = path.resolve(normalizedPath);

  if (!resolvedPath.startsWith(path.resolve(cdnPath))) {
    return false;
  }

  if (normalizedPath.includes("..") || normalizedPath.includes("..\\")) {
    return false;
  }

  return true;
};

export const pathValidationMiddleware = (req, res, next) => {
  const filePath = req.body.filePath || req.params.filePath;

  if (filePath && !validatePath(filePath)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid file path. Access denied.",
    });
  }

  next();
};
