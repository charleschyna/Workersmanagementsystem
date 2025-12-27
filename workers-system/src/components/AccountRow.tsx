"use client";

import { reassignAccount, deleteAccount, editAccount, unassignAccount } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Account = {
    id: string;
    accountName: string;
    email: string;
    password: string;
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
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState({
        accountName: account.accountName,
        email: account.email,
        password: account.password,
        browserType: account.browserType,
    });

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
        setIsLoading(true);
        await reassignAccount(formData);
        setIsLoading(false);
        router.refresh();
    }

    async function handleDelete(formData: FormData) {
        if (!confirm(`Delete account "${account.accountName}"?`)) {
            return;
        }
        await deleteAccount(formData);
        router.refresh();
    }

    async function handleUnassign(formData: FormData) {
        if (!confirm(`Unassign "${account.accountName}" from ${account.employee?.username}?`)) {
            return;
        }
        await unassignAccount(formData);
        router.refresh();
    }

    async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("accountId", account.id);
        formData.append("accountName", editData.accountName);
        formData.append("email", editData.email);
        formData.append("password", editData.password);
        formData.append("browserType", editData.browserType);
        
        await editAccount(formData);
        setIsEditing(false);
        router.refresh();
    }

    function cancelEdit() {
        setEditData({
            accountName: account.accountName,
            email: account.email,
            password: account.password,
            browserType: account.browserType,
        });
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <tr className="bg-gray-750">
                <td className="px-6 py-4">
                    <input
                        type="text"
                        value={editData.accountName}
                        onChange={(e) => setEditData({ ...editData, accountName: e.target.value })}
                        className="w-full rounded border-gray-600 bg-gray-700 text-white text-sm px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Account Name"
                    />
                </td>
                <td className="px-6 py-4">
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full rounded border-gray-600 bg-gray-700 text-white text-sm px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Email"
                    />
                </td>
                <td className="px-6 py-4">
                    <input
                        type="text"
                        value={editData.password}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                        className="w-full rounded border-gray-600 bg-gray-700 text-white text-sm px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Password"
                    />
                </td>
                <td className="px-6 py-4">
                    <select
                        value={editData.browserType}
                        onChange={(e) => setEditData({ ...editData, browserType: e.target.value })}
                        className="w-full rounded border-gray-600 bg-gray-700 text-white text-sm px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="IX Browser">IX Browser</option>
                        <option value="GoLogin">GoLogin</option>
                        <option value="More Login">More Login</option>
                    </select>
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
                    <form onSubmit={handleEdit} className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="text-green-400 hover:text-green-300"
                            title="Save changes"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-gray-400 hover:text-gray-300"
                            title="Cancel"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                {account.accountName}
            </td>
            <td className="px-6 py-4 text-sm text-gray-300">
                <div className="max-w-xs truncate" title={account.email}>
                    {account.email}
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-300">
                <div className="max-w-xs truncate" title={account.password}>
                    {account.password}
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
                    {/* Edit */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Edit account"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Reassign */}
                    <form action={handleReassign} className="inline">
                        <input type="hidden" name="accountId" value={account.id} />
                        <select
                            name="employeeId"
                            className="rounded border-gray-600 bg-gray-700 text-white text-xs px-2 py-1 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                            value={account.employeeId || ""}
                            disabled={isLoading}
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

                    {/* Unassign Button */}
                    {account.employeeId && (
                        <form action={handleUnassign} className="inline">
                            <input type="hidden" name="accountId" value={account.id} />
                            <button
                                type="submit"
                                className="text-yellow-400 hover:text-yellow-300"
                                title="Unassign from employee"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                </svg>
                            </button>
                        </form>
                    )}

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
