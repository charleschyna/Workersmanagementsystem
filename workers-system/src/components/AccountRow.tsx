"use client";

import { reassignAccount, deleteAccount } from "@/app/actions";
import { useRouter } from "next/navigation";

type Account = {
    id: string;
    accountName: string;
    loginDetails: string;
    browserType: string;
    status: string;
    employeeId: string | null;
    employee: { username: string } | null;
};

type Employee = {
    id: string;
    username: string;
};

export default function AccountRow({ account, employees }: { account: Account; employees: Employee[] }) {
    const router = useRouter();

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

    async function handleReassign(formData: FormData) {
        await reassignAccount(formData);
        router.refresh();
    }

    async function handleDelete(formData: FormData) {
        if (!confirm(`Delete account "${account.accountName}"?`)) {
            return;
        }
        await deleteAccount(formData);
        router.refresh();
    }

    return (
        <tr>
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
                    <form action={handleReassign} className="inline">
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
                    <form action={handleDelete} className="inline">
                        <input type="hidden" name="accountId" value={account.id} />
                        <button
                            type="submit"
                            className="text-red-400 hover:text-red-300"
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
    );
}
