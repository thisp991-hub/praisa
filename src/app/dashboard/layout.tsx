import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const userIsAdmin = user?.isAdmin ?? false;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isAdmin={userIsAdmin} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
