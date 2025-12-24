import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-white">TM</span>
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white tracking-tight">
                                    THEE MARTS SPACE
                                </span>
                                <p className="text-xs text-gray-400">Employee Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex space-x-1">
                                <Link
                                    href="/employee/accounts"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition"
                                >
                                    My Accounts
                                </Link>
                                <Link
                                    href="/employee/submit"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition"
                                >
                                    Submit Claim
                                </Link>
                            </div>
                            <div className="flex items-center space-x-3 pl-6 border-l border-gray-700">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                    <p className="text-xs text-gray-400">Employee</p>
                                </div>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
