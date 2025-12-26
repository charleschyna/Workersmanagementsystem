"use client";

import { acceptAccountWithEarnings } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Account = {
    id: string;
    accountName: string;
    loginDetails: string;
    browserType: string;
};

export default function AcceptAccountForm({ account }: { account: Account }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);
        
        const result = await acceptAccountWithEarnings(formData);
        
        if (result.success) {
            setMessage({ type: "success", text: "Account accepted successfully!" });
            setTimeout(() => {
                setIsOpen(false);
                router.refresh();
            }, 1500);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to accept account" });
        }
        
        setIsSubmitting(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
                Accept
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Accept Account: {account.accountName}</h3>
                            
                            {message && (
                                <div className={`p-3 mb-4 rounded-md ${message.type === "success" ? "bg-green-900 text-green-200 border border-green-700" : "bg-red-900 text-red-200 border border-red-700"}`}>
                                    {message.text}
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-4">
                                <input type="hidden" name="accountId" value={account.id} />
                                
                                <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-4">
                                    <p className="text-sm text-gray-300 mb-2"><strong>Login:</strong> {account.loginDetails}</p>
                                    <p className="text-sm text-gray-300"><strong>Browser:</strong> {account.browserType}</p>
                                </div>

                                <div className="bg-blue-900 border border-blue-700 p-3 rounded-md mb-4">
                                    <p className="text-sm text-blue-200">
                                        <strong>Important:</strong> Enter the current earnings in this account before you start working. This will be used to calculate your payment when you finish.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="initialEarnings" className="block text-sm font-medium text-gray-300 mb-2">
                                        Initial Account Earnings (USD) *
                                    </label>
                                    <input
                                        type="number"
                                        name="initialEarnings"
                                        id="initialEarnings"
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="e.g., 250.50"
                                        className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="initialEarningsProof" className="block text-sm font-medium text-gray-300 mb-2">
                                        Screenshot Proof *
                                    </label>
                                    <input
                                        type="file"
                                        name="initialEarningsProof"
                                        id="initialEarningsProof"
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
                                    <p className="mt-1 text-xs text-gray-500">Upload a screenshot showing current earnings</p>
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
                                        className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Accepting..." : "Accept Account"}
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
