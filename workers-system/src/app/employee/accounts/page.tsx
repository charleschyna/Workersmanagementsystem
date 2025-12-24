import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountActionButtons from "@/components/AccountActionButtons";

export default async function EmployeeAccountsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        redirect("/login");
    }

    // Fetch accounts assigned to this employee
    const accounts = await prisma.workAccount.findMany({
        where: { employeeId: user.id },
        orderBy: { assignedAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Assigned Accounts</h2>
                <span className="text-sm text-gray-400">{accounts.length} account(s)</span>
            </div>

            {accounts.length === 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-300">No accounts assigned</h3>
                    <p className="mt-1 text-sm text-gray-500">Wait for your manager to assign accounts to you.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {accounts.map((account) => (
                        <div key={account.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{account.accountName}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Browser: {account.browserType}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${account.status === 'Accepted' ? 'bg-green-900 text-green-200' :
                                        account.status === 'Paused' ? 'bg-yellow-900 text-yellow-200' :
                                            account.status === 'Left' ? 'bg-red-900 text-red-200' :
                                                'bg-blue-900 text-blue-200'
                                    }`}>
                                    {account.status}
                                </span>
                            </div>

                            <div className="mb-4 p-3 bg-gray-900 rounded border border-gray-700">
                                <p className="text-xs text-gray-400 mb-1">Login Details:</p>
                                <p className="text-sm text-gray-300 font-mono break-all">{account.loginDetails}</p>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                Assigned: {new Date(account.assignedAt).toLocaleDateString()}
                            </div>

                            <AccountActionButtons account={account} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
