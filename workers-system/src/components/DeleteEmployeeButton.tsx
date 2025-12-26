'use client';

import { deleteEmployee } from "@/app/actions";
import { useRef } from "react";

interface DeleteEmployeeButtonProps {
    employeeId: string;
    username: string;
}

export default function DeleteEmployeeButton({ employeeId, username }: DeleteEmployeeButtonProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        if (!confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) {
            return;
        }
        await deleteEmployee(formData);
    };

    return (
        <form ref={formRef} action={handleSubmit}>
            <input type="hidden" name="employeeId" value={employeeId} />
            <button
                type="submit"
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
            </button>
        </form>
    );
}
