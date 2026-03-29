import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    rfid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    subDepartment: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileDescription: String,
    fileSubject: String,

    fileYear: Number,

    // 🔥 MAIN DATES
    receivedDate: {
      type: Date,
      default: Date.now,
    },

    fileSharedBy: String,

    // 🔥 WORKFLOW USERS + DATES

    rfidTaggedBy: {
      type: String,
      required: true,
    },
    rfidTaggedAt: {
      type: Date,
      default: Date.now,
    },

    filePreparedBy: String,
    filePreparedAt: Date,

    pageNumberedBy: String,
    pageNumberedAt: Date,

    scannedBy: String,
    scannedAt: Date,

    qualityCheckedBy: String,
    qualityCheckedAt: Date,

    metadataAddedBy: String,
    metadataAddedAt: Date,

    finalApprovedBy: String,
    finalApprovedAt: Date,

    status: {
      type: String,
      enum: [
        "RFID_TAGGED",
        "FILE_PREPARED",
        "NUMBERED",
        "SCANNED",
        "QUALITY_CHECKED",
        "METADATA_ADDED",
        "APPROVED",
      ],
      default: "RFID_TAGGED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Document", documentSchema);
