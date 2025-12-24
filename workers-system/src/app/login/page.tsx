import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl border border-gray-700">
                <h1 className="mb-6 text-center text-2xl font-bold text-white">
                    Login
                </h1>
                <LoginForm />
            </div>
        </div>
    );
}
