"use client";

import { useAuth } from "@clerk/nextjs";
import api from "../lib/axios";
import { useState, useEffect } from "react";
import RFIDModal from "./RFIDModal";

export default function RFIDPage() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);

  const { getToken } = useAuth();

  const fetchRFID = async () => {
    try {
      const token = await getToken();

      const res = await api.get("/api/rfid", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRFID();
  }, []);

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* MAIN TITLE */}
      <h1 className="text-center text-2xl font-bold bg-green-900 text-yellow-400 py-3 border border-yellow-500">
        Document Digitization and Management Software
      </h1>

      {/* PROJECT BAR */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <div className="bg-green-900 text-white px-6 py-1 border border-yellow-500">
            Project
          </div>
          <div className="bg-gray-300 px-10 py-1 border">
            Bangalore Development Authority
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-green-900 text-yellow-400 px-4 py-1 border border-yellow-500">
            Profile
          </button>
          <button className="bg-green-900 text-yellow-400 px-4 py-1 border border-yellow-500">
            Log Out
          </button>
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="flex justify-center mt-6">
        <div className="bg-green-900 text-white px-10 py-2 border border-yellow-500">
          RFID Tagging Section
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6">
        <table className="w-full border text-sm text-center">
          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-2 border">Document RFID</th>
              <th className="border">Department</th>
              <th className="border">Sub Department</th>
              <th className="border">Received Date</th>
              <th className="border">RFID Tagged</th>
              <th className="border">RFID Tagging Date</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {data.map((doc) => {
              return (
                <tr key={doc._id} className="border-t bg-gray-100">
                  <td className="border p-1">{doc.rfid}</td>
                  <td className="border">{doc.department}</td>
                  <td className="border">{doc.subDepartment}</td>
                  <td className="border">
                    {doc.receivedDate
                      ? new Date(doc.receivedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border">
                    <div className="flex items-center gap-2 justify-center">
                      <img
                        src={
                          doc.userDetails?.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        className="w-6 h-6 rounded-full object-cover"
                        alt="user"
                      />
                      <span>{doc.userDetails?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="border">
                    {doc.rfidTaggedAt
                      ? new Date(doc.rfidTaggedAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        {/* TOTAL */}
        <div className="flex gap-4 items-center">
          <div className="bg-green-900 text-white px-6 py-2 border border-yellow-500">
            Total RFID Tagged Files
          </div>

          <div className="bg-gray-300 px-10 py-2">{data.length}</div>
        </div>

        {/* NEW DOCUMENT BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-900 text-yellow-400 px-6 py-2 border border-yellow-500"
        >
          New Document
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <RFIDModal onClose={() => setShowModal(false)} refresh={fetchRFID} />
      )}
    </div>
  );
}
