import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createEmployee } from "@/app/actions";
import DeleteEmployeeButton from "@/components/DeleteEmployeeButton";

export default async function ManageEmployeesPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        redirect("/dashboard");
    }

    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        orderBy: { createdAt: "desc" },
    });

    async function handleCreateEmployee(formData: FormData) {
        "use server";
        await createEmployee(formData);
        redirect("/manager/employees");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Employees</h1>
                    <p className="text-sm text-gray-400 mt-1">View and manage worker accounts</p>
                </div>
                <Link href="/manager/dashboard" className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Create New Employee Form */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Add New Employee</h3>
                <form action={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1">
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                            Password *
                        </label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            required
                            className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>

            {/* Employees List */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">All Employees ({employees.length})</h3>
                </div>

                {employees.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-white mb-2">No Employees</h3>
                        <p className="text-gray-400">Add your first employee to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Password
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Date Added
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {employee.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{employee.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded border border-gray-700">
                                                {employee.password}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(employee.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <DeleteEmployeeButton 
                                                employeeId={employee.id}
                                                username={employee.username}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
