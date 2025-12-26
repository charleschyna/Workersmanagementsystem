"use client";

import { useState } from "react";

export default function EarningsProofViewer({ 
    initialProof, 
    finalProof,
    accountName 
}: { 
    initialProof?: string | null; 
    finalProof?: string | null;
    accountName: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const hasProofs = initialProof || finalProof;

    if (!hasProofs) {
        return null;
    }

    return (
        <div className="mt-3 pt-3 border-t border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
                <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {isOpen ? 'Hide' : 'View'} Earnings Proof Screenshots
            </button>

            {isOpen && (
                <div className="mt-4 space-y-4">
                    {initialProof && (
                        <div>
                            <p className="text-xs text-gray-500 mb-2 font-medium">Initial Earnings Proof:</p>
                            <img 
                                src={initialProof} 
                                alt="Initial earnings proof" 
                                className="max-w-md rounded border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors" 
                                onClick={() => window.open(initialProof, '_blank')}
                                title="Click to open in new tab"
                            />
                        </div>
                    )}
                    {finalProof && (
                        <div>
                            <p className="text-xs text-gray-500 mb-2 font-medium">Final Earnings Proof:</p>
                            <img 
                                src={finalProof} 
                                alt="Final earnings proof" 
                                className="max-w-md rounded border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors" 
                                onClick={() => window.open(finalProof, '_blank')}
                                title="Click to open in new tab"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
