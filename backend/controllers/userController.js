import User from "../models/User.js";
import { clerkClient, getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "users" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });
};
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      role,
      department,
      subDepartment,
    } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // 🔹 Check Clerk
    const existingUsers = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    let clerkUser;

    if (existingUsers.data.length > 0) {
      clerkUser = existingUsers.data[0];

      await clerkClient.users.updateUser(clerkUser.id, {
        publicMetadata: { role },
      });
    } else {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        skipPasswordRequirement: true,
        publicMetadata: { role },
      });
    }

    // 🔹 Mongo
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) {
      user = await User.create({
        clerkId: clerkUser.id,
        firstName,
        lastName,
        phone,
        email,
        role,
        department,
        subDepartment,
        profileImage: imageUrl,
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone;
      user.email = email;
      user.role = role;
      user.department = department;
      user.subDepartment = subDepartment;
      if (imageUrl) user.profileImage = imageUrl;

      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const createOrGetUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const clerkUser = await clerkClient.users.getUser(userId);

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        role: clerkUser.publicMetadata?.role || "DepartmentUser",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get All Users (ADMIN ONLY)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get Current User Profile
export const getMyProfile = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get User By ID (ADMIN)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      firstName,
      lastName,
      phone,
      email,
      role,
      department,
      subDepartment,
    } = body;

    // 🔍 FIND USER
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 IMAGE HANDLING
    let imageUrl = user.profileImage;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);

        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("❌ CLOUDINARY ERROR:", uploadErr);
      }
    } else {
      console.log("⚠️ NO IMAGE UPLOADED");
    }

    try {
      await clerkClient.users.updateUser(user.clerkId, {
        publicMetadata: { role },
      });
    } catch (clerkErr) {
      console.error("❌ CLERK ERROR:", clerkErr);
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;
    user.role = role;
    user.department = department;
    user.subDepartment = subDepartment;
    user.profileImage = imageUrl;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("🔥 UPDATE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 Delete from Clerk
    await clerkClient.users.deleteUser(user.clerkId);

    // 🔥 Delete from MongoDB
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
