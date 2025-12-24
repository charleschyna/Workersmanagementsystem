import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="text-3xl font-bold text-white">TM</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white text-center tracking-tight mb-3">
                        THEE MARTS SPACE
                    </h1>
                    <p className="text-xl text-blue-300 text-center">Workers Management System</p>
                </div>

                <p className="text-lg text-gray-300 text-center max-w-2xl mb-12 leading-relaxed">
                    Streamline your workforce operations with our comprehensive management platform.
                    Track tasks, manage payroll, and oversee your team efficiently.
                </p>

                <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                    <span>Access Portal</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>

                <div className="mt-20 text-center text-sm text-gray-500">
                    <p>© 2024 Thee Marts Space. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
