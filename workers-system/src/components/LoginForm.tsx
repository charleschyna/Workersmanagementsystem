"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid username or password");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mb-6 shadow-2xl">
                        <span className="text-5xl font-bold text-white">TM</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-3">THEE MARTS SPACE</h1>
                    <p className="text-xl text-gray-400">Workers Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-10">
                    <h2 className="text-2xl font-semibold text-white mb-8">Sign in to your account</h2>

                    {error && (
                        <div className="mb-8 p-5 bg-red-900/50 border border-red-700 rounded-xl">
                            <p className="text-base text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div>
                            <label htmlFor="username" className="block text-base font-medium text-gray-300 mb-3">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                autoComplete="username"
                                className="w-full px-5 py-4 text-lg bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-base font-medium text-gray-300 mb-3">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="w-full px-5 py-4 text-lg bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-base text-gray-500 mt-8">
                    © 2024 Thee Marts Space. All rights reserved.
                </p>
            </div>
        </div>
    );
}
