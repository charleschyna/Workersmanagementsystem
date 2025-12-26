"use client";

import { pauseAccount } from "@/app/actions";
import { useState } from "react";
import AcceptAccountForm from "./AcceptAccountForm";
import LeaveAccountForm from "./LeaveAccountForm";

type Account = {
    id: string;
    status: string;
    accountName: string;
    loginDetails: string;
    browserType: string;
    initialEarnings: any;
};

export default function AccountActionButtons({ account }: { account: Account }) {
    const [loading, setLoading] = useState(false);

    async function handlePause() {
        if (loading) return;
        setLoading(true);
        await pauseAccount(account.id);
        setLoading(false);
    }

    const accountData = {
        id: account.id,
        accountName: account.accountName,
        loginDetails: account.loginDetails,
        browserType: account.browserType,
        initialEarnings: account.initialEarnings?.toString() || null
    };

    if (account.status === "Assigned") {
        return <AcceptAccountForm account={accountData} />;
    }

    if (account.status === "Accepted") {
        return (
            <div className="flex gap-2">
                <button
                    onClick={handlePause}
                    disabled={loading}
                    className="rounded bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                >
                    {loading ? "..." : "Pause"}
                </button>
                <LeaveAccountForm account={accountData} />
            </div>
        );
    }

    if (account.status === "Paused") {
        return (
            <div className="flex gap-2">
                <AcceptAccountForm account={accountData} />
                <LeaveAccountForm account={accountData} />
            </div>
        );
    }

    return (
        <div className="text-xs text-gray-500">
            Left
        </div>
    );
}
