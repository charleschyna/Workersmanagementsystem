"use client";

import { updateManagerCredentials } from "@/app/actions";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            setLoading(false);
            return;
        }

        const result = await updateManagerCredentials(formData);
        setLoading(false);

        if (result.success) {
            setMessage({ type: "success", text: "Credentials updated successfully! Please log in again." });
            setTimeout(() => {
                signOut({ callbackUrl: "/login" });
            }, 2000);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to update credentials" });
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h2>
                    <p className="text-slate-600">Update your username and password</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                        <p className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
                            {message.text}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                            Current Password *
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Username</h3>
                        <div>
                            <label htmlFor="newUsername" className="block text-sm font-medium text-slate-700 mb-2">
                                New Username (optional)
                            </label>
                            <input
                                type="text"
                                name="newUsername"
                                id="newUsername"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                    New Password (optional)
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? "Updating..." : "Update Credentials"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> After updating your credentials, you will be logged out and need to sign in again with your new username/password.
                    </p>
                </div>
            </div>
        </div>
    );
}
