import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { markAccountAsPaid } from "@/app/actions";
import Link from "next/link";
import EarningsProofViewer from "@/components/EarningsProofViewer";

export default async function PayrollPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        redirect("/dashboard");
    }

    // Fetch accounts that have been left (with final earnings) and not yet paid
    const unpaidAccounts = await prisma.workAccount.findMany({
        where: {
            status: "Left",
            finalEarnings: { not: null },
            isPaid: false,
        },
        include: {
            employee: true,
        },
        orderBy: {
            finalEarningsDate: "desc"
        }
    });

    // Group by employee
    const payrollSummary = unpaidAccounts.reduce((acc: Record<string, { 
        employee: any; 
        accounts: any[];
        totalEarned: number;
        accountsCount: number;
    }>, account) => {
        const employeeId = account.employeeId!;
        if (!acc[employeeId]) {
            acc[employeeId] = {
                employee: account.employee,
                accounts: [],
                totalEarned: 0,
                accountsCount: 0,
            };
        }
        
        const initial = account.initialEarnings ? parseFloat(account.initialEarnings.toString()) : 0;
        const final = account.finalEarnings ? parseFloat(account.finalEarnings.toString()) : 0;
        const earned = final - initial;
        
        acc[employeeId].accounts.push({
            ...account,
            earned: earned
        });
        acc[employeeId].totalEarned += earned;
        acc[employeeId].accountsCount += 1;
        return acc;
    }, {});

    async function markPaidAction(formData: FormData) {
        "use server";
        await markAccountAsPaid(formData);
        redirect("/manager/payroll");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Payroll Management</h1>
                <div className="flex gap-2">
                    <Link href="/manager/dashboard" className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
                <p className="text-sm text-blue-200">
                    <strong>New Payment System:</strong> Payments are now calculated based on account earnings difference (Final Earnings - Initial Earnings). Individual task submissions are tracked separately for activity monitoring.
                </p>
            </div>

            {Object.keys(payrollSummary).length === 0 ? (
                <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">No Pending Payments</h3>
                    <p className="text-gray-400">All accounts have been paid or no accounts have been completed yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.values(payrollSummary).map(({ employee, accounts, totalEarned, accountsCount }) => (
                        <div key={employee.id} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{employee.username}</h3>
                                    <p className="text-sm text-green-100">{accountsCount} completed account{accountsCount > 1 ? 's' : ''}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-100">Total Payment</p>
                                    <p className="text-3xl font-bold text-white">${totalEarned.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Account</p>
                                                    <p className="text-sm font-medium text-white">{account.accountName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Initial Earnings</p>
                                                    <p className="text-sm text-gray-300">${account.initialEarnings?.toString() || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Final Earnings</p>
                                                    <p className="text-sm text-gray-300">${account.finalEarnings?.toString() || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Amount Earned</p>
                                                    <p className="text-lg font-bold text-green-400">${account.earned.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Started</p>
                                                    <p className="text-xs text-gray-400">{account.initialEarningsDate ? new Date(account.initialEarningsDate).toLocaleString() : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Completed</p>
                                                    <p className="text-xs text-gray-400">{account.finalEarningsDate ? new Date(account.finalEarningsDate).toLocaleString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            <EarningsProofViewer 
                                                initialProof={account.initialEarningsProof}
                                                finalProof={account.finalEarningsProof}
                                                accountName={account.accountName}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <form action={markPaidAction} className="flex justify-end">
                                    <input type="hidden" name="employeeId" value={employee.id} />
                                    <button
                                        type="submit"
                                        className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Mark All as Paid - ${totalEarned.toFixed(2)}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
