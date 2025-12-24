"use client";

import { approveClaim, rejectClaim } from "../app/actions";
import { useState } from "react";

export default function ClaimActionButtons({ claimId }: { claimId: string }) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        if (confirm("Are you sure you want to approve this claim?")) {
            setLoading(true);
            await approveClaim(claimId);
            setLoading(false);
        }
    };

    const handleReject = async () => {
        const reason = prompt("Please enter a reason for rejection:");
        if (reason) {
            setLoading(true);
            await rejectClaim(claimId, reason);
            setLoading(false);
        }
    };

    return (
        <div className="flex space-x-2">
            <button
                onClick={handleApprove}
                disabled={loading}
                className="inline-flex items-center rounded border border-transparent bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
                Approve
            </button>
            <button
                onClick={handleReject}
                disabled={loading}
                className="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
                Reject
            </button>
        </div>
    );
}
