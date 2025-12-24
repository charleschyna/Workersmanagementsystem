import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-24 text-white">
            <div className="relative z-10 max-w-2xl text-center">
                <div className="mb-8 inline-block rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm">
                    Internal Tool v2.0
                </div>
                <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Workers Management System
                </h1>
                <p className="mb-10 text-lg text-gray-400 sm:text-xl">
                    Streamline your task claims, manage payroll, and track employee performance in one unified platform.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/login"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                        <span className="mr-2">Access Portal</span>
                        <svg
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[100px] bg-blue-600/30 rounded-full pointer-events-none"></div>
        </main>
    );
}
