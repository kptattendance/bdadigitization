"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#111",
        color: "#fff",
      }}
    >
      {/* Left */}
      <div>
        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
          <h2>DocuTrack</h2>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link href="/" style={{ color: "#fff" }}>
          Home
        </Link>

        {isSignedIn && (
          <Link href="/dashboard" style={{ color: "#fff" }}>
            Dashboard
          </Link>
        )}

        {!isSignedIn ? (
          <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
            <button className="px-3 py-2 bg-green-500 text-white rounded">
              Login
            </button>
          </SignInButton>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
}
