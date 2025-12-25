import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createAccount, deleteAccount, reassignAccount } from "@/app/actions";
import { redirect } from "next/navigation";

export default async function ManageAccountsPage() {
    const [accounts, employees] = await Promise.all([
        prisma.workAccount.findMany({
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

    async function deleteAccountAction(formData: FormData) {
        "use server";
        await deleteAccount(formData);
        redirect("/manager/accounts");
    }

    async function reassignAccountAction(formData: FormData) {
        "use server";
        await reassignAccount(formData);
        redirect("/manager/accounts");
    }

    const getStatusBadge = (status: string, hasEmployee: boolean) => {
        if (!hasEmployee) {
            return <span className="inline-flex items-center rounded-full bg-gray-600 px-2.5 py-0.5 text-xs font-medium text-gray-100">Unassigned</span>;
        }
        switch (status) {
            case "Accepted":
                return <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">Active</span>;
            case "Paused":
                return <span className="inline-flex items-center rounded-full bg-yellow-600 px-2.5 py-0.5 text-xs font-medium text-white">Paused</span>;
            case "Left":
                return <span className="inline-flex items-center rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">Left</span>;
            case "Assigned":
                return <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">Assigned</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-gray-600 px-2.5 py-0.5 text-xs font-medium text-gray-100">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-2xl font-bold text-white">Manage Accounts</h2>
                    <Link href="/manager/dashboard" className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Create New Account Form */}
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Create New Account</h3>
                <form action={createAccountAction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="accountName" className="block text-xs font-medium text-gray-300 mb-1">
                            Account Name *
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            id="accountName"
                            required
                            placeholder="e.g., john.doe@example.com"
                            className="block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="loginDetails" className="block text-xs font-medium text-gray-300 mb-1">
                            Login Details *
                        </label>
                        <input
                            type="text"
                            name="loginDetails"
                            id="loginDetails"
                            required
                            placeholder="Password or login info"
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
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Login Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Browser</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 bg-gray-800">
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        No accounts created yet. Create your first account above.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                            {account.accountName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            <div className="max-w-xs truncate" title={account.loginDetails}>
                                                {account.loginDetails}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                            {account.browserType}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                            {account.employee ? (
                                                <span className="font-medium text-blue-400">{account.employee.username}</span>
                                            ) : (
                                                <span className="text-gray-500 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {getStatusBadge(account.status, !!account.employee)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                {/* Reassign */}
                                                <form action={reassignAccountAction} className="inline">
                                                    <input type="hidden" name="accountId" value={account.id} />
                                                    <select
                                                        name="employeeId"
                                                        className="rounded border-gray-600 bg-gray-700 text-white text-xs px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                                                        defaultValue={account.employeeId || ""}
                                                        onChange={(e) => (e.target.form as HTMLFormElement).requestSubmit()}
                                                    >
                                                        <option value="">Unassign</option>
                                                        {employees.map((emp) => (
                                                            <option key={emp.id} value={emp.id}>
                                                                {emp.username}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </form>

                                                {/* Delete */}
                                                <form action={deleteAccountAction} className="inline">
                                                    <input type="hidden" name="accountId" value={account.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={(e) => {
                                                            if (!confirm(`Delete account "${account.accountName}"?`)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        title="Delete account"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
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
