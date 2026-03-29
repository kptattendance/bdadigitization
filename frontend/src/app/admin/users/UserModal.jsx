"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "../../lib/axios";

export default function UserModal({ onClose, refresh, user }) {
  const { getToken } = useAuth();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const departmentsData = [
    {
      name: "Finance",
      subDepartments: ["Receivables", "Payroll", "Vendor Payments", "Audit"],
    },
    {
      name: "Administration",
      subDepartments: ["Security", "Transport", "Facility", "Housekeeping"],
    },
    {
      name: "IT Cell",
      subDepartments: ["Hardware", "Software", "Networking", "Support"],
    },
    {
      name: "Engineering",
      subDepartments: ["Projects", "Maintenance", "Design"],
    },
    {
      name: "Land Acquisition",
      subDepartments: ["Legal", "Survey", "Compensation"],
    },
    { name: "HR", subDepartments: ["Recruitment", "Training", "Payroll"] },
  ];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "",
    department: "",
    subDepartment: "",
  });

  const [subDeps, setSubDeps] = useState([]);

  // ✅ PREFILL WHEN EDIT
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
        role: user.role || "",
        department: user.department || "",
        subDepartment: user.subDepartment || "",
      });

      setPreview(user.profileImage || "");

      const selected = departmentsData.find((d) => d.name === user.department);
      setSubDeps(selected?.subDepartments || []);
    }
  }, [user]);

  const handleImage = (e) => {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleDeptChange = (e) => {
    const dept = e.target.value;

    const selected = departmentsData.find((d) => d.name === dept);

    setForm({ ...form, department: dept, subDepartment: "" });
    setSubDeps(selected?.subDepartments || []);
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      if (!form.firstName || !form.email || !form.role) {
        alert("First Name, Email, Role required");
        return;
      }

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (file) formData.append("image", file);

      if (user) {
        // ✅ UPDATE
        await api.put(`/api/users/${user._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // ✅ CREATE
        await api.post("/api/users/add", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const label =
    "w-40 bg-green-900 text-white px-2 py-1 border border-yellow-500";
  const input = "flex-1 bg-gray-200 border px-2 py-1";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-gray-100 w-[900px] max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-center bg-green-900 text-white py-2 mb-6">
          {user ? "Edit User" : "User Creation"}
        </h2>

        {/* IMAGE */}
        <div className="flex justify-center mb-4">
          <div>
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input type="file" onChange={handleImage} />
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 items-center">
            <label className={label}>First Name</label>
            <input
              className={input}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className={label}>Last Name</label>
            <input
              className={input}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className={label}>Phone</label>
            <input
              className={input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className={label}>Email</label>
            <input
              className={input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* ROLE */}
          <div className="flex gap-2 items-center">
            <label className={label}>Role</label>
            <select
              className={input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>

              <option value="SuperAdmin">Super Admin</option>
              <option value="admin">Admin</option>

              <option value="RFIDTagging">RFID Tagging</option>
              <option value="FilePreparation">File Preparation</option>
              <option value="Numbering">Numbering</option>
              <option value="Scanning">Scanning</option>
              <option value="Quality">Quality Check</option>
              <option value="Metadata">Metadata Entry</option>
              <option value="FinalReview">Final Review</option>

              <option value="DepartmentUser">Department User</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div className="flex gap-2 items-center">
            <label className={label}>Department</label>
            <select
              className={input}
              value={form.department}
              onChange={handleDeptChange}
            >
              <option value="">Select Department</option>
              {departmentsData.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUB DEPT */}
          <div className="flex gap-2 items-center">
            <label className={label}>Sub Department</label>
            <select
              className={input}
              value={form.subDepartment}
              disabled={!form.department}
              onChange={(e) =>
                setForm({ ...form, subDepartment: e.target.value })
              }
            >
              <option value="">Select</option>
              {subDeps.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-green-900 text-yellow-300 px-6 py-2"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-900 text-yellow-300 px-6 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
