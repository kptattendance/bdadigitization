import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: [
        "SuperAdmin",
        "admin",
        "RFIDTagging",
        "FilePreparation",
        "Numbering",
        "Scanning",
        "Quality",
        "Metadata",
        "FinalReview",
        "DepartmentUser",
      ],
      required: true,
    },

    department: {
      type: String,
      default: "", // initially empty allowed
    },

    subDepartment: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String, // Cloudinary URL
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
