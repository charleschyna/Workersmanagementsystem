import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { markAsPaid } from "@/app/actions";

export default async function PayrollPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        redirect("/dashboard");
    }

    // Fetch approved but unpaid claims
    const unpaidClaims = await prisma.taskClaim.findMany({
        where: {
            status: "Approved",
            isPaid: false,
        },
        include: {
            employee: true,
        },
    });

    const RATE_PER_HOUR = 15;

    // Group by employee
    const payrollSummary = unpaidClaims.reduce((acc: Record<string, { employee: any; totalHours: number; claimsCount: number; totalPay: number }>, claim) => {
        const employeeId = claim.employeeId;
        if (!acc[employeeId]) {
            acc[employeeId] = {
                employee: claim.employee,
                totalHours: 0,
                claimsCount: 0,
                totalPay: 0,
            };
        }
        const hours = Number(claim.timeSpentHours);
        acc[employeeId].totalHours += hours;
        acc[employeeId].claimsCount += 1;
        acc[employeeId].totalPay += hours * RATE_PER_HOUR;
        return acc;
    }, {});

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Payroll Summary</h1>

            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-white">Unpaid Approved Claims</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-400">Rate: ${RATE_PER_HOUR}/hr</p>
                </div>
                <ul role="list" className="divide-y divide-gray-700">
                    {Object.values(payrollSummary).map((item) => (
                        <li key={item.employee.id} className="px-4 py-4 sm:px-6 hover:bg-gray-750">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-blue-400 truncate">
                                        {item.employee.username}
                                    </p>
                                    <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                                        <p>
                                            {item.claimsCount} claims • {item.totalHours.toFixed(2)} hours
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <p className="text-lg font-bold text-green-400">
                                            ${item.totalPay.toFixed(2)}
                                        </p>
                                    </div>
                                    <form action={async () => {
                                        "use server";
                                        await markAsPaid(item.employee.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Mark as Paid
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </li>
                    ))}
                    {Object.keys(payrollSummary).length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No unpaid approved claims found.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
