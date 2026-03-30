"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/");
      return;
    }

    const role = user?.publicMetadata?.role;

    switch (role) {
      case "RFIDTagging":
        router.push("/rfid");
        break;
      case "SuperAdmin":
        router.push("/admin");
        break;
      default:
        router.push("/department");
    }
  }, [isLoaded, isSignedIn]);

  return <div>Loading...</div>;
}
