import SubmitClaimForm from "@/components/SubmitClaimForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SubmitClaimPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        redirect("/login");
    }

    // Fetch accounts assigned to this employee
    const accounts = await prisma.workAccount.findMany({
        where: { employeeId: user.id },
        orderBy: { assignedAt: "desc" },
    });

    return <SubmitClaimForm accounts={accounts} />;
}
