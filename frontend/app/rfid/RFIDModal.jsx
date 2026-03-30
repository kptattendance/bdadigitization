"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "../lib/axios";

export default function RFIDModal({ onClose, refresh, editData }) {
  const { getToken } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);

  const [form, setForm] = useState({
    rfid: "",
    department: "",
    subDepartment: "",
    fileName: "",
    fileSubject: "",
    fileYear: new Date().getFullYear(),

    fileSharedBy: "",

    // ✅ TWO DATES
    receivedDate: "", // user input
    rfidTaggedDate: new Date().toISOString().split("T")[0], // auto today

    fileDescription: "",
    taggedBy: "",
  });

  // ✅ Department Mapping
  const departmentMap = {
    Finance: ["Receivables", "Payroll", "Vendor Payments", "Audit"],

    Administration: ["Security", "Transport", "Facility", "Housekeeping"],

    "IT Cell": ["Hardware", "Software", "Networking", "Support"],

    Engineering: ["Projects", "Maintenance", "Design"],

    "Land Acquisition": ["Legal", "Survey", "Compensation"],

    HR: ["Recruitment", "Training", "Payroll"],
  };

  // ✅ Fetch Logged-in User
  const fetchUser = async () => {
    try {
      const token = await getToken();

      const res = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUser(res.data);

      // 🔥 Auto fill
      setForm((prev) => ({
        ...prev,
        department: res.data.department || "",
        subDepartment: res.data.subDepartment || "",
        taggedBy: res.data.firstName + " " + res.data.lastName,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();

    if (editData) {
      setForm({
        ...editData,
        rfidTaggedDate:
          editData.rfidTaggedDate || new Date().toISOString().split("T")[0],
      });
    }
  }, []);

  // ✅ Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async () => {
    try {
      const token = await getToken();

      if (editData) {
        await api.put(`/api/rfid/${editData._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/rfid", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error saving");
    }
  };

  // 🎨 Styles
  const label =
    "w-44 bg-green-900 text-white px-2 py-1 text-sm border border-yellow-500";
  const input = "flex-1 border border-gray-300 bg-gray-200 px-2 py-1 text-sm";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-100 w-[950px] max-h-[90vh] flex flex-col rounded shadow-lg">
        {/* Header */}
        <div className="relative bg-green-900 text-white text-center py-2 border border-yellow-500 font-semibold">
          RFID Tagging Section
          {/* ❌ CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xl font-bold hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* RFID */}
            <div className="flex gap-2 items-center">
              <label className={label}>RFID Tag</label>
              <input
                name="rfid"
                value={form.rfid}
                onChange={handleChange}
                className={input}
              />
            </div>

            {/* File Shared */}
            <div className="flex gap-2 items-center">
              <label className={label}>File Shared By</label>
              <input
                name="fileSharedBy"
                value={form.fileSharedBy}
                onChange={handleChange}
                className={input}
              />
            </div>
            {/* Received Date (USER INPUT) */}
            <div className="flex gap-2 items-center">
              <label className={label}>Received Date</label>
              <input
                type="date"
                name="receivedDate"
                value={form.receivedDate}
                onChange={handleChange}
                className={input}
              />
            </div>

            {/* RFID Tagging Date (AUTO) */}
            <div className="flex gap-2 items-center">
              <label className={label}>RFID Tagging Date</label>
              <input
                type="date"
                name="rfidTaggedDate"
                value={form.rfidTaggedDate}
                onChange={handleChange}
                className="flex-1 border border-gray-300 bg-gray-200 px-2 py-1 text-sm"
              />
            </div>

            {/* Tagged By */}
            <div className="flex gap-2 items-center">
              <label className={label}>RFID Tagged By</label>
              <input
                value={form.taggedBy}
                className="flex-1 bg-gray-300 px-2 py-1 text-sm"
                disabled
              />
            </div>

            {/* Department */}
            <div className="flex gap-2 items-center">
              <label className={label}>Department</label>
              <select
                name="department"
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value,
                    subDepartment: "",
                  })
                }
                className={input}
              >
                <option value="">Select Department</option>

                {Object.keys(departmentMap).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Department */}
            <div className="flex gap-2 items-center">
              <label className={label}>Sub Department</label>
              <select
                name="subDepartment"
                value={form.subDepartment}
                onChange={handleChange}
                className={input}
              >
                <option value="">Select Sub Department</option>

                {departmentMap[form.department]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* File Name */}
            <div className="flex gap-2 items-center">
              <label className={label}>File Name</label>
              <input
                name="fileName"
                value={form.fileName}
                onChange={handleChange}
                className={input}
              />
            </div>

            {/* File Subject */}
            <div className="flex gap-2 items-center">
              <label className={label}>File Subject</label>
              <input
                name="fileSubject"
                value={form.fileSubject}
                onChange={handleChange}
                className={input}
              />
            </div>

            {/* File Year */}
            <div className="flex gap-2 items-center">
              <label className={label}>File Year</label>
              <input
                type="text"
                name="fileYear"
                value={form.fileYear}
                onChange={(e) => {
                  const value = e.target.value;

                  // allow only 4 digit year
                  if (/^\d{0,4}$/.test(value)) {
                    setForm({ ...form, fileYear: value });
                  }
                }}
                placeholder="YYYY"
                className="flex-1 border border-gray-300 bg-gray-200 px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 flex gap-2">
            <label className={`${label} h-fit`}>File Description</label>
            <textarea
              name="fileDescription"
              value={form.fileDescription}
              onChange={handleChange}
              className="flex-1 border border-gray-300 bg-gray-200 px-2 py-2 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-6 p-4 border-t">
          <button
            onClick={onClose}
            className="bg-green-900 text-yellow-300 px-6 py-2 border border-yellow-500"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-900 text-yellow-300 px-6 py-2 border border-yellow-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
