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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex items-center gap-12 w-full max-w-6xl">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 shadow-2xl">
              <div className="bg-gray-800 rounded-2xl p-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <span className="text-5xl font-bold text-white">TM</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">THEE MARTS SPACE</h2>
                <p className="text-gray-400 mb-8">Manage your workforce efficiently</p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">100%</div>
                    <div className="text-sm text-gray-400">Accurate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">Fast</div>
                    <div className="text-sm text-gray-400">Processing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-10 w-full lg:w-96">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">THEE MARTS SPACE</h1>
              <p className="text-gray-400 text-sm">Workers Management System</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm text-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full px-4 py-3 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                placeholder="Username"
              />

              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
                placeholder="Password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2024 Thee Marts Space
          </p>
        </div>
      </div>
    </div>
  );
}
