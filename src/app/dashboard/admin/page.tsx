import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { getAllBusinessProfiles } from "@/app/actions/subscription";
import { getAccessCodes } from "@/app/actions/access-codes";
import { AdminClient } from "./admin-client";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user?.isAdmin) {
    redirect("/dashboard");
  }

  const profiles = await getAllBusinessProfiles();
  const accessCodes = await getAccessCodes();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      <p className="mt-2 text-gray-600">
        Manage client businesses and access codes.
      </p>

      <AdminClient initialProfiles={profiles} initialAccessCodes={accessCodes} />
    </div>
  );
}
