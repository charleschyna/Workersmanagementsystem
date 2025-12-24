"use client";

import { acceptAccount, pauseAccount, leaveAccount } from "@/app/actions";
import { useState } from "react";

type Account = {
    id: string;
    status: string;
};

export default function AccountActionButtons({ account }: { account: Account }) {
    const [loading, setLoading] = useState(false);

    async function handleAction(action: (id: string) => Promise<any>) {
        if (loading) return;
        setLoading(true);
        await action(account.id);
        setLoading(false);
    }

    if (account.status === "Assigned") {
        return (
            <button
                onClick={() => handleAction(acceptAccount)}
                disabled={loading}
                className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? "Processing..." : "Accept Account"}
            </button>
        );
    }

    if (account.status === "Accepted") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => handleAction(pauseAccount)}
                    disabled={loading}
                    className="flex-1 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Pause"}
                </button>
                <button
                    onClick={() => handleAction(leaveAccount)}
                    disabled={loading}
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Leave"}
                </button>
            </div>
        );
    }

    if (account.status === "Paused") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={() => handleAction(acceptAccount)}
                    disabled={loading}
                    className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Resume"}
                </button>
                <button
                    onClick={() => handleAction(leaveAccount)}
                    disabled={loading}
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Leave"}
                </button>
            </div>
        );
    }

    return (
        <div className="text-sm text-gray-500 text-center py-2">
            Account has been left
        </div>
    );
}
