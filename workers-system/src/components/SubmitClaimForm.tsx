"use client";

import { submitClaim } from "@/app/actions";
import { useState } from "react";

type Account = {
    id: string;
    accountName: string;
    status: string;
};

export default function SubmitClaimForm({ accounts }: { accounts: Account[] }) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Filter to only show accepted accounts
    const acceptedAccounts = accounts.filter(acc => acc.status === "Accepted");

    async function clientAction(formData: FormData) {
        const result = await submitClaim(formData);
        if (result.success) {
            setMessage({ type: "success", text: "Claim submitted successfully!" });
            // Reset form
            (document.getElementById("claim-form") as HTMLFormElement)?.reset();
        } else {
            setMessage({ type: "error", text: result.error || "Failed to submit claim" });
        }
    }

    if (acceptedAccounts.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">No Accepted Accounts</h3>
                    <p className="text-gray-400 mb-4">You need to accept an account before submitting claims.</p>
                    <a href="/employee/accounts" className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        View My Accounts
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Submit Task Claim</h2>

                {message && (
                    <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-900 text-green-200 border border-green-700" : "bg-red-900 text-red-200 border border-red-700"}`}>
                        {message.text}
                    </div>
                )}

                <form id="claim-form" action={clientAction} className="space-y-6">
                    <div>
                        <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">
                            Platform
                        </label>
                        <select
                            name="platform"
                            id="platform"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        >
                            <option value="">Select Platform</option>
                            <option value="Outlier">Outlier</option>
                            <option value="Handshake">Handshake</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-2">
                            Account Name
                        </label>
                        <select
                            name="accountName"
                            id="accountName"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        >
                            <option value="">Select Account</option>
                            {acceptedAccounts.map((account) => (
                                <option key={account.id} value={account.accountName}>
                                    {account.accountName}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">Only showing your accepted accounts</p>
                    </div>

                    <div>
                        <label htmlFor="taskExternalId" className="block text-sm font-medium text-gray-300 mb-2">
                            Task External ID
                        </label>
                        <input
                            type="text"
                            name="taskExternalId"
                            id="taskExternalId"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time Spent
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="timeSpentHours" className="block text-xs text-gray-400 mb-1">
                                    Hours
                                </label>
                                <input
                                    type="number"
                                    name="timeSpentHours"
                                    id="timeSpentHours"
                                    min="0"
                                    defaultValue="0"
                                    required
                                    className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="timeSpentMinutes" className="block text-xs text-gray-400 mb-1">
                                    Minutes
                                </label>
                                <input
                                    type="number"
                                    name="timeSpentMinutes"
                                    id="timeSpentMinutes"
                                    min="0"
                                    max="59"
                                    defaultValue="0"
                                    required
                                    className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Enter 0 hours and 30 minutes for a 30-minute task</p>
                    </div>

                    <div>
                        <label htmlFor="screenshot" className="block text-sm font-medium text-gray-300 mb-2">
                            Screenshot
                        </label>
                        <input
                            type="file"
                            name="screenshot"
                            id="screenshot"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Submit Claim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
