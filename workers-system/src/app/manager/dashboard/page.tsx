import { prisma } from "@/lib/prisma";
import ClaimActionButtons from "@/components/ClaimActionButtons";
import Link from "next/link";
import HistoryDropdown from "@/components/HistoryDropdown";

export default async function ManagerDashboardPage() {
    // Fetch all data in parallel
    const [pendingClaims, allEmployees, allAccounts, pausedAccounts, leftAccounts] = await Promise.all([
        prisma.taskClaim.findMany({
            where: { status: "Pending" },
            include: { employee: true },
            orderBy: { submittedAt: "desc" },
        }),
        prisma.user.findMany({
            where: { role: "EMPLOYEE" },
            orderBy: { username: "asc" },
        }),
        prisma.workAccount.findMany({
            where: {
                employeeId: { not: null }
            },
            include: { employee: true },
            orderBy: { assignedAt: "desc" },
        }),
        prisma.workAccount.findMany({
            where: { 
                status: "Paused",
                employeeId: { not: null }
            },
            include: { employee: true },
            orderBy: { assignedAt: "desc" },
        }),
        prisma.workAccount.findMany({
            where: { 
                status: "Left",
                employeeId: { not: null }
            },
            include: { employee: true },
            orderBy: { assignedAt: "desc" },
        }),
    ]);

    // Group pending claims by employee
    const groupedClaims = pendingClaims.reduce((acc, claim) => {
        const username = claim.employee.username;
        if (!acc[username]) {
            acc[username] = {
                employee: claim.employee,
                claims: [],
            };
        }
        acc[username].claims.push(claim);
        return acc;
    }, {} as Record<string, { employee: any; claims: typeof pendingClaims }>);

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h2 className="text-2xl font-bold text-white">Manager Dashboard</h2>
                    <div className="flex flex-wrap items-center gap-2">

                        <HistoryDropdown employees={allEmployees} />

                        <Link href="/manager/accounts" className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Manage Accounts
                        </Link>

                        <Link href="/manager/add-employee" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            Add Employee
                        </Link>

                        <Link href="/manager/assign-account" className="inline-flex items-center rounded-md bg-cyan-500 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-600">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Assign Account
                        </Link>

                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                            Pending Review
                        </span>
                    </div>
                </div>

                {/* Notifications */}
                {(pausedAccounts.length > 0 || leftAccounts.length > 0) && (
                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-medium text-gray-400">Notifications</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {pausedAccounts.map((account) => (
                                <div key={account.id} className="flex items-center rounded-md bg-yellow-50 p-4 text-yellow-800">
                                    <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <div>
                                        <span className="font-bold">{account.employee?.username}</span> has PAUSED the account <span className="font-bold">{account.accountName}</span> (ID: {account.id})
                                    </div>
                                </div>
                            ))}
                            {leftAccounts.map((account) => (
                                <div key={account.id} className="flex items-center rounded-md bg-red-50 p-4 text-red-800">
                                    <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <div>
                                        <span className="font-bold">{account.employee?.username}</span> has LEFT the account <span className="font-bold">{account.accountName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grouped Claims */}
                <div className="mt-8 space-y-6">
                    {Object.values(groupedClaims).map(({ employee, claims }) => (
                        <div key={employee.id} className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                            <div className="flex items-center justify-between bg-white px-4 py-3">
                                <div className="flex items-center">
                                    <span className="text-lg font-bold text-blue-600">{employee.username}</span>
                                </div>
                                <span className="rounded-full bg-gray-600 px-3 py-1 text-xs font-medium text-white">
                                    {claims.length} Pending
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Platform</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Account</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Task ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Time (Hrs)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Proof</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700 bg-gray-900">
                                        {claims.map((claim) => (
                                            <tr key={claim.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex items-center rounded bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-100">
                                                        {claim.platform}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{claim.accountName}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-pink-500 font-mono">{claim.taskExternalId}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{claim.timeSpentHours.toString()}</td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                                    {claim.screenshot ? (
                                                        <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center text-xs">Img</div>
                                                    ) : (
                                                        <span className="text-gray-500">No Image</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                                    {new Date(claim.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                    <ClaimActionButtons claimId={claim.id} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedClaims).length === 0 && (
                        <div className="text-center py-10 text-gray-500">No pending claims.</div>
                    )}
                </div>
            </div>

            {/* Assigned Accounts Overview */}
            <div className="rounded-lg bg-gray-800 shadow-lg">
                <div className="border-b border-gray-700 px-6 py-4">
                    <h3 className="text-lg font-medium leading-6 text-white">Assigned Accounts Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Account Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Browser</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Assigned At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 bg-gray-800">
                            {allAccounts.map((account) => (
                                <tr key={account.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                                        {account.employee?.username || "Unassigned"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{account.accountName}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{account.browserType}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {account.status === 'Accepted' && <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Accepted</span>}
                                        {account.status === 'Paused' && <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Paused</span>}
                                        {account.status === 'Left' && <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Left</span>}
                                        {account.status === 'Assigned' && <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Assigned</span>}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                        {new Date(account.assignedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {allAccounts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No accounts assigned.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
