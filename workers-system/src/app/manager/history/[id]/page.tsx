import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EmployeeHistoryPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { date?: string };
}) {
    const employee = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!employee) {
        notFound();
    }

    const selectedDate = searchParams.date
        ? new Date(searchParams.date)
        : new Date();

    // Set time to start and end of the selected day (UTC)
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const claims = await prisma.taskClaim.findMany({
        where: {
            employeeId: employee.id,
            submittedAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: { submittedAt: "desc" },
    });

    const totalHours = claims.reduce((sum, claim) => sum + Number(claim.timeSpentHours), 0);
    const ratePerHour = 15;
    const totalPay = totalHours * ratePerHour;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                    History: <span className="text-blue-400">{employee.username}</span>
                </h2>
                <Link href="/manager/history" className="text-sm text-gray-400 hover:text-white">
                    &larr; Back to List
                </Link>
            </div>

            {/* Date Filter */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
                <label htmlFor="date" className="text-gray-300">Select Date:</label>
                <form className="flex gap-2">
                    <input
                        type="date"
                        name="date"
                        defaultValue={selectedDate.toISOString().split('T')[0]}
                        className="rounded bg-gray-700 border-gray-600 text-white px-3 py-1"
                    />
                    <button type="submit" className="bg-blue-600 px-3 py-1 rounded text-white text-sm">Filter</button>
                </form>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Tasks</h3>
                    <p className="text-3xl font-bold text-white mt-2">{claims.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Hours</h3>
                    <p className="text-3xl font-bold text-white mt-2">{totalHours.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Pay (Est.)</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">${totalPay.toFixed(2)}</p>
                </div>
            </div>

            {/* Claims Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Platform</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Account</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Task ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                        {claims.map((claim) => (
                            <tr key={claim.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.platform}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.accountName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-pink-500">{claim.taskExternalId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{claim.timeSpentHours.toString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            claim.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {new Date(claim.submittedAt).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                        {claims.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No records found for this date.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
