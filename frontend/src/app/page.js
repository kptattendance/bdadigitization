"use client";

import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <h1>Welcome to Document System</h1>

      {isSignedIn ? (
        <>
          <p>Hello, {user?.firstName || "User"} 👋</p>
          <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
        </>
      ) : (
        <p>Please login to continue</p>
      )}
    </div>
  );
}
