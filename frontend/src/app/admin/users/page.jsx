"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import api from "../../lib/axios";
import UserModal from "./UserModal";

export default function UsersPage() {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // ✅ added

  const fetchUsers = async () => {
    const token = await getToken();

    const res = await api.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    if (!isLoaded) return;
    fetchUsers();
  }, [isLoaded]);

  const handleDelete = async (id) => {
    const token = await getToken();

    await api.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <button
        onClick={() => {
          setEditingUser(null); // ✅ reset for create
          setShowModal(true);
        }}
        className="mb-4 bg-green-900 text-yellow-300 px-4 py-2 border border-yellow-500"
      >
        + Add User
      </button>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-green-900 text-white">
          <tr>
            <th className="p-2">Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">
                <img
                  src={
                    u.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>

              <td>
                {u.firstName} {u.lastName}
              </td>

              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department}</td>

              <td className="flex gap-2 p-2">
                {/* ✅ EDIT */}
                <button
                  onClick={() => {
                    setEditingUser(u);
                    setShowModal(true);
                  }}
                  className="bg-yellow-500 px-2 py-1"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 px-2 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <UserModal
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          refresh={fetchUsers}
          user={editingUser} // ✅ pass user
        />
      )}
    </div>
  );
}
