import { assignAccount } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AssignAccountPage() {
    const [employees, unassignedAccounts] = await Promise.all([
        prisma.user.findMany({
            where: { role: "EMPLOYEE" },
            orderBy: { username: "asc" },
        }),
        prisma.workAccount.findMany({
            where: {
                OR: [
                    { employeeId: null },
                    { status: "Left" }
                ]
            },
            orderBy: { assignedAt: "desc" },
        })
    ]);

    async function serverAction(formData: FormData) {
        "use server";
        await assignAccount(formData);
        redirect("/manager/dashboard");
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
                <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm text-blue-200">
                            <strong>Quick Assignment:</strong> Select an existing account and assign it to an employee. 
                            To create new accounts, go to <Link href="/manager/accounts" className="underline font-medium hover:text-white">Manage Accounts</Link>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Assign Account to Employee</h2>

                {unassignedAccounts.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-lg font-medium text-white mb-2">No Available Accounts</h3>
                        <p className="text-gray-400 mb-4">All accounts are currently assigned. Create new accounts or wait for accounts to become available.</p>
                        <Link href="/manager/accounts" className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create New Account
                        </Link>
                    </div>
                ) : (
                    <form action={serverAction} className="space-y-6">
                        <div>
                            <label htmlFor="accountId" className="block text-sm font-medium text-gray-300 mb-2">
                                Select Account *
                            </label>
                            <select
                                name="accountId"
                                id="accountId"
                                required
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                onChange={(e) => {
                                    const select = e.target as HTMLSelectElement;
                                    const selected = unassignedAccounts.find(a => a.id === select.value);
                                    if (selected) {
                                        const detailsDiv = document.getElementById('account-details');
                                        if (detailsDiv) {
                                            detailsDiv.innerHTML = `
                                                <div class="bg-gray-900 p-4 rounded border border-gray-700">
                                                    <div class="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <span class="text-xs text-gray-500">Email:</span>
                                                            <p class="text-sm text-white">${selected.email}</p>
                                                        </div>
                                                        <div>
                                                            <span class="text-xs text-gray-500">Password:</span>
                                                            <p class="text-sm text-white">${selected.password}</p>
                                                        </div>
                                                        <div>
                                                            <span class="text-xs text-gray-500">Browser:</span>
                                                            <p class="text-sm text-white">${selected.browserType}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    }
                                }}
                            >
                                <option value="">-- Select an Account --</option>
                                {unassignedAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.accountName} {account.status === 'Left' ? '(Previously Left)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Account Details Preview */}
                        <div id="account-details"></div>

                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-300 mb-2">
                                Assign To Employee *
                            </label>
                            <select
                                name="employeeId"
                                id="employeeId"
                                required
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                            >
                                <option value="">-- Select Employee --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Link href="/manager/dashboard" className="text-sm text-gray-400 hover:text-white">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="rounded-md bg-cyan-600 px-6 py-2 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Assign Account
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <Link href="/manager/accounts" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manage All Accounts
                    </Link>
                </div>
            </div>
        </div>
    );
}

