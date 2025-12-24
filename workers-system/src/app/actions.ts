"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitClaim(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const platform = formData.get("platform") as string;
    const accountName = formData.get("accountName") as string;
    const taskExternalId = formData.get("taskExternalId") as string;
    const timeSpentHours = parseFloat(formData.get("timeSpentHours") as string);
    const screenshotFile = formData.get("screenshot") as File;
    const screenshotPath = screenshotFile?.name || "no-screenshot.png";

    // Fetch the user from database by username
    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    try {
        await prisma.taskClaim.create({
            data: {
                employeeId: user.id,
                platform,
                accountName,
                taskExternalId,
                timeSpentHours,
                screenshot: screenshotPath,
                status: "Pending",
            },
        });
    } catch (e: any) {
        console.error("Submit claim error:", e);
        if (e.code === 'P2002') {
            return { success: false, error: "This task ID already exists for this platform." };
        }
        return { success: false, error: e.message || "Failed to submit claim." };
    }

    revalidatePath("/employee/submit");
    revalidatePath("/manager/dashboard");
    return { success: true };
}

export async function approveClaim(claimId: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    await prisma.taskClaim.update({
        where: { id: claimId },
        data: { status: "Approved" },
    });

    revalidatePath("/manager/dashboard");
    return { success: true };
}

export async function rejectClaim(claimId: string, reason: string) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    await prisma.taskClaim.update({
        where: { id: claimId },
        data: {
            status: "Rejected",
            managerNotes: reason
        },
    });

    revalidatePath("/manager/dashboard");
    return { success: true };
}

export async function markAsPaid(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const employeeId = formData.get("employeeId") as string;

    await prisma.taskClaim.updateMany({
        where: {
            employeeId: employeeId,
            status: "Approved",
            isPaid: false,
        },
        data: { isPaid: true },
    });

    revalidatePath("/manager/payroll");
    return { success: true };
}


export async function addEmployee(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const username = formData.get("username") as string;

    // Generate random 5-char password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const password = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    try {
        await prisma.user.create({
            data: {
                username,
                password, // In a real app, hash this!
                role: "EMPLOYEE",
            },
        });
        revalidatePath("/manager/dashboard");
        return { success: true, password };
    } catch (error) {
        console.error("Failed to create employee:", error);
        return { success: false, error: "Failed to create employee" };
    }
}

export async function assignAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountName = formData.get("accountName") as string;
    const loginDetails = formData.get("loginDetails") as string;
    const browserType = formData.get("browserType") as string;
    const employeeId = formData.get("employeeId") as string;

    try {
        await prisma.workAccount.create({
            data: {
                accountName,
                loginDetails,
                browserType,
                status: "Assigned",
                employeeId: employeeId || null,
            },
        });
        revalidatePath("/manager/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign account:", error);
        return { success: false, error: "Failed to assign account" };
    }
}

export async function acceptAccount(accountId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const account = await prisma.workAccount.findFirst({
            where: { id: accountId, employeeId: user.id },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        const updateData: any = { status: "Accepted" };
        if (account.status === "Paused") {
            updateData.recentlyUnpaused = true;
        }

        await prisma.workAccount.update({
            where: { id: accountId },
            data: updateData,
        });

        revalidatePath("/employee/accounts");
        revalidatePath("/manager/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to accept account:", error);
        return { success: false };
    }
}

export async function pauseAccount(accountId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        await prisma.workAccount.update({
            where: { id: accountId, employeeId: user.id },
            data: { status: "Paused" },
        });

        revalidatePath("/employee/accounts");
        revalidatePath("/manager/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to pause account:", error);
        return { success: false };
    }
}

export async function leaveAccount(accountId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        await prisma.workAccount.update({
            where: { id: accountId, employeeId: user.id },
            data: { status: "Left" },
        });

        revalidatePath("/employee/accounts");
        revalidatePath("/manager/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to leave account:", error);
        return { success: false };
    }
}

export async function updateManagerCredentials(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newUsername = formData.get("newUsername") as string;
    const newPassword = formData.get("newPassword") as string;

    try {
        const user = await prisma.user.findUnique({
            where: { username: session.user.name || "" },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        if (user.password !== currentPassword) {
            return { success: false, error: "Current password is incorrect" };
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                username: newUsername || user.username,
                password: newPassword || user.password,
            },
        });

        revalidatePath("/manager/settings");
        return { success: true, newUsername: newUsername || user.username };
    } catch (error) {
        console.error("Failed to update credentials:", error);
        return { success: false, error: "Failed to update credentials" };
    }
}
