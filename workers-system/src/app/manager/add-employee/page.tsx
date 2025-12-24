"use client";

import { addEmployee } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";

export default function AddEmployeePage() {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        const result = await addEmployee(formData);
        if (result.success) {
            setMessage({ type: "success", text: "Employee created successfully!" });
            setGeneratedPassword(result.password || null);
        } else {
            setMessage({ type: "error", text: result.error || "Failed to create employee" });
            setGeneratedPassword(null);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Add New Employee</h2>

                {message && (
                    <div className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
                        {message.text}
                        {generatedPassword && (
                            <div className="mt-2 font-mono text-lg font-bold">
                                Password: {generatedPassword}
                            </div>
                        )}
                    </div>
                )}

                <form action={clientAction} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <Link href="/manager/dashboard" className="text-sm text-gray-400 hover:text-white">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
