import Document from "../models/documentModel.js";
import { getAuth } from "@clerk/express";

import User from "../models/User.js";
// 🔹 Create RFID (New Document)
export const createRFID = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      rfid,
      department,
      subDepartment,
      fileName,
      fileDescription,
      fileSubject,
      fileYear,
      receivedDate,
      fileSharedBy,
    } = req.body;

    // 🔥 VALIDATION (IMPORTANT)
    if (!rfid || !department || !subDepartment || !fileName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate RFID
    const existing = await Document.findOne({ rfid });
    if (existing) {
      return res.status(400).json({ message: "RFID already exists" });
    }

    const newDoc = await Document.create({
      rfid,
      department,
      subDepartment,
      fileName,
      fileDescription,
      fileSubject,
      fileYear,
      receivedDate,
      fileSharedBy,

      // 🔥 FIXED HERE
      rfidTaggedBy: userId,
      rfidTaggedAt: new Date(),

      status: "RFID_TAGGED",
    });

    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Create RFID Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllRFID = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });

    let documents;

    if (user.role === "admin" || user.role === "SuperAdmin") {
      documents = await Document.find().sort({ createdAt: -1 });
    } else {
      documents = await Document.find({
        rfidTaggedBy: userId,
      }).sort({ createdAt: -1 });
    }

    // 🔥 ADD USER DETAILS
    const docsWithUser = await Promise.all(
      documents.map(async (doc) => {
        const u = await User.findOne({ clerkId: doc.rfidTaggedBy });

        return {
          ...doc.toObject(),
          userDetails: u
            ? {
                name: `${u.firstName} ${u.lastName}`,
                image: u.profileImage,
              }
            : null,
        };
      }),
    );

    res.json(docsWithUser);
  } catch (error) {
    console.error("Get RFID Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Single Document
export const getRFIDById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(doc);
  } catch (error) {
    console.error("Get Single RFID Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 Update RFID (for later modules also)
export const updateRFID = async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update RFID Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 Delete RFID (optional)
export const deleteRFID = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete RFID Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
