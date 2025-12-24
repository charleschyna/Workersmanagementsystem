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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Branding (60% on desktop) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-bold text-white">TM</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">THEE MARTS SPACE</h1>
              <p className="text-blue-200">Workers Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-bold text-white leading-tight">
            Streamline Your<br />
            Workforce Management
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
            Efficient task tracking, seamless payroll management, and comprehensive employee oversight - all in one powerful platform.
          </p>
          
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-sm text-blue-200">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-blue-200">Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">Fast</div>
              <div className="text-sm text-blue-200">Processing</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © 2024 Thee Marts Space. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form (40% on desktop) */}
      <div className="flex-1 lg:w-2/5 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-4">
              <span className="text-3xl font-bold text-white">TM</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">THEE MARTS SPACE</h1>
            <p className="text-gray-400">Workers Management System</p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 mb-8">Sign in to access your dashboard</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Need help? Contact your administrator
            </p>
          </div>

          <p className="lg:hidden text-center text-sm text-gray-500 mt-6">
            © 2024 Thee Marts Space. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
