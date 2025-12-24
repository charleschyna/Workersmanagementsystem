import { assignAccount } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AssignAccountPage() {
    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        orderBy: { username: "asc" },
    });

    async function serverAction(formData: FormData) {
        "use server";
        await assignAccount(formData);
        redirect("/manager/dashboard");
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Assign Work Account</h2>

                <form action={serverAction} className="space-y-4">
                    <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-300">
                            Account Name
                        </label>
                        <input
                            type="text"
                            name="accountName"
                            id="accountName"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="loginDetails" className="block text-sm font-medium text-gray-300">
                            Login Details
                        </label>
                        <textarea
                            name="loginDetails"
                            id="loginDetails"
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="browserType" className="block text-sm font-medium text-gray-300">
                            Browser Type
                        </label>
                        <select
                            name="browserType"
                            id="browserType"
                            required
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="IX Browser">IX Browser</option>
                            <option value="GoLogin">GoLogin</option>
                            <option value="AdsPower">AdsPower</option>
                            <option value="Dolphin Anty">Dolphin Anty</option>
                            <option value="Incogniton">Incogniton</option>
                            <option value="Chrome">Chrome</option>
                            <option value="Firefox">Firefox</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-300">
                            Assign To (Optional)
                        </label>
                        <select
                            name="employeeId"
                            id="employeeId"
                            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">-- Unassigned --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <Link href="/manager/dashboard" className="text-sm text-gray-400 hover:text-white">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Assign Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
