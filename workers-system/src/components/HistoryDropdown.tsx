"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type User = {
    id: string;
    username: string;
};

export default function HistoryDropdown({ employees }: { employees: User[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
            >
                <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                View History
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-700">
                    <div className="py-1">
                        {employees.length > 0 ? (
                            employees.map((emp) => (
                                <Link
                                    key={emp.id}
                                    href={`/manager/history/${emp.id}`}
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {emp.username}
                                </Link>
                            ))
                        ) : (
                            <span className="block px-4 py-2 text-sm text-gray-500">
                                No employees found
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
