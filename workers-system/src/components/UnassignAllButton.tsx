"use client";

import { unassignAllAccounts } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UnassignAllButton({ assignedCount }: { assignedCount: number }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleUnassignAll() {
        if (!confirm(`Are you sure you want to unassign ALL ${assignedCount} assigned accounts? This will remove all employees from their accounts.`)) {
            return;
        }

        setIsLoading(true);
        try {
            await unassignAllAccounts();
            router.refresh();
        } catch (error) {
            console.error("Failed to unassign all accounts:", error);
            alert("Failed to unassign accounts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (assignedCount === 0) {
        return null;
    }

    return (
        <button
            onClick={handleUnassignAll}
            disabled={isLoading}
            className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
            {isLoading ? "Unassigning..." : "Unassign All Accounts"}
        </button>
    );
}
