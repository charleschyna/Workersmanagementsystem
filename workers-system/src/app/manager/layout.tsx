import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // @ts-ignore
    if (session.user?.role !== "MANAGER") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-xl font-bold text-blue-500 tracking-wider">
                                    THEE MARTS SPACE
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex space-x-4">
                                <Link
                                    href="/manager/dashboard"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/manager/payroll"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                    Payroll
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-400">
                                    {session.user?.name}
                                </span>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
