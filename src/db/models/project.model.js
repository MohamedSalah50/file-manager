import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
  },
  folderName: {
    type: String,
    required: [true, "Folder name is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

projectSchema.index({ folderName: 1 });

const projectModel = model("Project", projectSchema);
export default projectModel;
