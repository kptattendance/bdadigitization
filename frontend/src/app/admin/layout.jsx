"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useUser();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Documents", path: "/admin/documents" },
    { name: "Approvals", path: "/admin/approvals" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* 🔹 Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block p-2 rounded ${
                  pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user?.firstName || "Admin"} 👋
        </h1>

        {children}
      </main>
    </div>
  );
}
