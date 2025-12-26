import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createAccount } from "@/app/actions";
import { redirect } from "next/navigation";
import AccountRow from "@/components/AccountRow";
import UnassignAllButton from "@/components/UnassignAllButton";

export default async function ManageAccountsPage() {
    const [accounts, employees] = await Promise.all([
        prisma.workAccount.findMany({
            where: {
                status: { not: "Left" } // Only show active accounts, not completed ones
            },
            include: { employee: true },
            orderBy: { assignedAt: "desc" },
        }),
        prisma.user.findMany({
            where: { role: "EMPLOYEE" },
            orderBy: { username: "asc" },
        }),
    ]);

    async function createAccountAction(formData: FormData) {
        "use server";
        await createAccount(formData);
        redirect("/manager/accounts");
    }

    const assignedCount = accounts.filter(a => a.employeeId !== null).length;

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-2xl font-bold text-white">Manage Accounts</h2>
                    <div className="flex flex-wrap gap-2">
                        <UnassignAllButton assignedCount={assignedCount} />
                        <Link href="/manager/dashboard" className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Create New Account Form */}
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Create New Account</h3>
                <form action={createAccountAction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label htmlFor="accountName" className="block text-xs font-medium text-gray-300 mb-1">
                            Account Name *
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            id="accountName"
                            required
                            placeholder="e.g., John Doe"
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder="email@example.com"
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                            Password *
                        </label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            required
                            placeholder="Account password"
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="browserType" className="block text-xs font-medium text-gray-300 mb-1">
                            Browser Type *
                        </label>
                        <select
                            name="browserType"
                            id="browserType"
                            required
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        >
                            <option value="IX Browser">IX Browser</option>
                            <option value="GoLogin">GoLogin</option>
                            <option value="AdsPower">AdsPower</option>
                            <option value="Dolphin Anty">Dolphin Anty</option>
                            <option value="Incogniton">Incogniton</option>
                            <option value="Chrome">Chrome</option>
                            <option value="Firefox">Firefox</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <svg className="inline-block mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Account
                        </button>
                    </div>
                </form>
            </div>

            {/* Accounts List */}
            <div className="rounded-lg bg-gray-800 shadow-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Account Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Password</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Browser</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 bg-gray-800">
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                        No accounts created yet. Create your first account above.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <AccountRow key={account.id} account={account} employees={employees} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-white">{accounts.length}</div>
                    <div className="text-xs text-gray-400">Total Accounts</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-green-500">{accounts.filter(a => a.status === "Accepted").length}</div>
                    <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-yellow-500">{accounts.filter(a => a.status === "Paused").length}</div>
                    <div className="text-xs text-gray-400">Paused</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-red-500">{accounts.filter(a => a.status === "Left").length}</div>
                    <div className="text-xs text-gray-400">Left</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-gray-500">{accounts.filter(a => !a.employeeId).length}</div>
                    <div className="text-xs text-gray-400">Unassigned</div>
                </div>
            </div>
        </div>
    );
}
