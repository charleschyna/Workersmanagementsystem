"use client";

import { leaveAccountWithEarnings } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Account = {
    id: string;
    accountName: string;
    initialEarnings: string | null;
};

export default function LeaveAccountForm({ account }: { account: Account }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);
        
        const result = await leaveAccountWithEarnings(formData);
        
        if (result.success) {
            setMessage({ type: "success", text: `Account left. You earned $${result.earnings}!` });
            setTimeout(() => {
                setIsOpen(false);
                router.refresh();
            }, 2000);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to leave account" });
        }
        
        setIsSubmitting(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
                Leave
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Leave Account: {account.accountName}</h3>
                            
                            {message && (
                                <div className={`p-3 mb-4 rounded-md ${message.type === "success" ? "bg-green-900 text-green-200 border border-green-700" : "bg-red-900 text-red-200 border border-red-700"}`}>
                                    {message.text}
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-4">
                                <input type="hidden" name="accountId" value={account.id} />
                                
                                {account.initialEarnings && (
                                    <div className="bg-gray-900 p-4 rounded border border-gray-700">
                                        <p className="text-sm text-gray-400">Initial Earnings</p>
                                        <p className="text-2xl font-bold text-white">${account.initialEarnings}</p>
                                    </div>
                                )}

                                <div className="bg-yellow-900 border border-yellow-700 p-3 rounded-md mb-4">
                                    <p className="text-sm text-yellow-200">
                                        <strong>Final Step:</strong> Enter the current total earnings in the account. The system will calculate your payment automatically.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="finalEarnings" className="block text-sm font-medium text-gray-300 mb-2">
                                        Final Account Earnings (USD) *
                                    </label>
                                    <input
                                        type="number"
                                        name="finalEarnings"
                                        id="finalEarnings"
                                        step="0.01"
                                        min={account.initialEarnings || "0"}
                                        required
                                        placeholder="e.g., 450.75"
                                        className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="finalEarningsProof" className="block text-sm font-medium text-gray-300 mb-2">
                                        Screenshot Proof *
                                    </label>
                                    <input
                                        type="file"
                                        name="finalEarningsProof"
                                        id="finalEarningsProof"
                                        accept="image/*"
                                        required
                                        className="block w-full text-sm text-gray-300
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-600 file:text-white
                                            hover:file:bg-blue-700
                                            cursor-pointer"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Upload a screenshot showing final earnings</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting..." : "Leave Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
