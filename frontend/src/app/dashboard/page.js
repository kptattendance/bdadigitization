import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  // 🔥 Role-based redirect (FULL MAPPING)
  switch (role) {
    case "SuperAdmin":
      return redirect("/admin");

    case "ProjectManager":
      return redirect("/project-manager");

    case "RFIDTagging":
      return redirect("/rfid");

    case "FilePreparing":
      return redirect("/file-preparing");

    case "FileNumbering":
      return redirect("/file-numbering");

    case "Scanning":
      return redirect("/scanning");

    case "Quality":
      return redirect("/quality");

    case "Metadata":
      return redirect("/metadata");

    case "DocumentReview":
      return redirect("/review");

    case "Department":
      return redirect("/department");

    default:
      return redirect("/department"); // fallback
  }
}
