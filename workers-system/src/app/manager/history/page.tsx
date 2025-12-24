import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HistoryListPage() {
    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        orderBy: { username: "asc" },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Employee History</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {employees.map((emp) => (
                    <Link
                        key={emp.id}
                        href={`/manager/history/${emp.id}`}
                        className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold">
                                {emp.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">{emp.username}</h3>
                                <p className="text-sm text-gray-400">View Records</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
