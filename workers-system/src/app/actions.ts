"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function submitClaim(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const platform = formData.get("platform") as string;
    const accountName = formData.get("accountName") as string;
    const taskExternalId = formData.get("taskExternalId") as string;
    const hours = parseInt(formData.get("timeSpentHours") as string) || 0;
    const minutes = parseInt(formData.get("timeSpentMinutes") as string) || 0;
    const timeSpentHours = hours + (minutes / 60);
    const screenshotFile = formData.get("screenshot") as File;
    
    let screenshotPath = "no-screenshot.png";
    
    // Handle file upload if provided
    if (screenshotFile && screenshotFile.size > 0) {
        try {
            // Convert file to base64 for storage
            const bytes = await screenshotFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            screenshotPath = `data:${screenshotFile.type};base64,${base64}`;
        } catch (fileError) {
            console.error("Error processing file:", fileError);
            // Continue with default if file processing fails
        }
    }

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
            return { success: false, error: "This task ID has already been submitted. Each task ID can only be used once." };
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

export async function markAccountAsPaid(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const employeeId = formData.get("employeeId") as string;

    await prisma.workAccount.updateMany({
        where: {
            employeeId: employeeId,
            status: "Left",
            isPaid: false,
        },
        data: { 
            isPaid: true,
            paidAt: new Date()
        },
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

export async function createAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountName = formData.get("accountName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const browserType = formData.get("browserType") as string;

    try {
        await prisma.workAccount.create({
            data: {
                accountName,
                email,
                password,
                browserType,
                status: "Assigned",
                employeeId: null,
            },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to create account:", error);
        return { success: false, error: "Failed to create account" };
    }
}

export async function editAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountId = formData.get("accountId") as string;
    const accountName = formData.get("accountName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const browserType = formData.get("browserType") as string;

    try {
        await prisma.workAccount.update({
            where: { id: accountId },
            data: {
                accountName,
                email,
                password,
                browserType,
            },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to edit account:", error);
        return { success: false, error: "Failed to edit account" };
    }
}

export async function assignAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountId = formData.get("accountId") as string;
    const employeeId = formData.get("employeeId") as string;

    try {
        await prisma.workAccount.update({
            where: { id: accountId },
            data: {
                status: "Assigned",
                employeeId: employeeId || null,
            },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/assign-account");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign account:", error);
        return { success: false, error: "Failed to assign account" };
    }
}

export async function reassignAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountId = formData.get("accountId") as string;
    const employeeId = formData.get("employeeId") as string;

    try {
        // Get the existing account
        const existingAccount = await prisma.workAccount.findUnique({
            where: { id: accountId }
        });

        if (!existingAccount) {
            return { success: false, error: "Account not found" };
        }

        // If the account has already been worked on (has finalEarnings), create a new record
        // to preserve the previous work session history
        if (existingAccount.finalEarnings !== null) {
            // Create new account record with the same details
            await prisma.workAccount.create({
                data: {
                    accountName: existingAccount.accountName,
                    email: existingAccount.email,
                    password: existingAccount.password,
                    browserType: existingAccount.browserType,
                    status: "Assigned",
                    employeeId: employeeId || null,
                }
            });
        } else {
            // If account hasn't been worked on yet, just update it normally
            await prisma.workAccount.update({
                where: { id: accountId },
                data: {
                    status: employeeId ? "Assigned" : "Assigned",
                    employeeId: employeeId || null,
                },
            });
        }
        
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to reassign account:", error);
        return { success: false, error: "Failed to reassign account" };
    }
}

export async function deleteAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountId = formData.get("accountId") as string;

    try {
        await prisma.workAccount.delete({
            where: { id: accountId },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete account:", error);
        return { success: false, error: "Failed to delete account" };
    }
}

export async function unassignAllAccounts() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.workAccount.updateMany({
            where: {
                employeeId: { not: null }
            },
            data: {
                employeeId: null,
                status: "Assigned"
            },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to unassign all accounts:", error);
        return { success: false, error: "Failed to unassign all accounts" };
    }
}

export async function unassignAccount(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const accountId = formData.get("accountId") as string;

    try {
        await prisma.workAccount.update({
            where: { id: accountId },
            data: {
                employeeId: null,
                status: "Assigned"
            },
        });
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/accounts");
        return { success: true };
    } catch (error) {
        console.error("Failed to unassign account:", error);
        return { success: false, error: "Failed to unassign account" };
    }
}

export async function acceptAccountWithEarnings(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    const accountId = formData.get("accountId") as string;
    const initialEarnings = parseFloat(formData.get("initialEarnings") as string);
    const proofFile = formData.get("initialEarningsProof") as File;
    
    let proofPath = "";
    if (proofFile && proofFile.size > 0) {
        try {
            const bytes = await proofFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            proofPath = `data:${proofFile.type};base64,${base64}`;
        } catch (error) {
            return { success: false, error: "Failed to process screenshot" };
        }
    }

    try {
        const account = await prisma.workAccount.findFirst({
            where: { id: accountId, employeeId: user.id },
        });

        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const updateData: any = { 
            status: "Accepted",
            initialEarnings,
            initialEarningsProof: proofPath,
            initialEarningsDate: new Date()
        };
        
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
        return { success: false, error: "Failed to accept account" };
    }
}

export async function leaveAccountWithEarnings(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.name || "" },
    });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    const accountId = formData.get("accountId") as string;
    const finalEarnings = parseFloat(formData.get("finalEarnings") as string);
    const proofFile = formData.get("finalEarningsProof") as File;
    
    let proofPath = "";
    if (proofFile && proofFile.size > 0) {
        try {
            const bytes = await proofFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            proofPath = `data:${proofFile.type};base64,${base64}`;
        } catch (error) {
            return { success: false, error: "Failed to process screenshot" };
        }
    }

    try {
        const account = await prisma.workAccount.findFirst({
            where: { id: accountId, employeeId: user.id },
        });

        if (!account) {
            return { success: false, error: "Account not found" };
        }

        const initialEarnings = account.initialEarnings ? parseFloat(account.initialEarnings.toString()) : 0;
        const earnedAmount = finalEarnings - initialEarnings;

        await prisma.workAccount.update({
            where: { id: accountId },
            data: { 
                status: "Left",
                employeeId: null,
                finalEarnings,
                finalEarningsProof: proofPath,
                finalEarningsDate: new Date()
            },
        });

        revalidatePath("/employee/accounts");
        revalidatePath("/manager/dashboard");
        revalidatePath("/manager/payroll");
        return { success: true, earnings: earnedAmount.toFixed(2) };
    } catch (error) {
        console.error("Failed to leave account:", error);
        return { success: false, error: "Failed to leave account" };
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

export async function deleteEmployee(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const employeeId = formData.get("employeeId") as string;

    try {
        // Delete all related records first
        await prisma.taskClaim.deleteMany({
            where: { employeeId },
        });

        await prisma.workAccount.deleteMany({
            where: { employeeId },
        });

        // Then delete the employee
        await prisma.user.delete({
            where: { id: employeeId },
        });

        revalidatePath("/manager/employees");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete employee:", error);
        return { success: false, error: "Failed to delete employee" };
    }
}

export async function createEmployee(formData: FormData) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (session?.user?.role !== "MANAGER") {
        throw new Error("Unauthorized");
    }

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        await prisma.user.create({
            data: {
                username,
                password: password,
                role: "EMPLOYEE",
            },
        });

        revalidatePath("/manager/employees");
        return { success: true };
    } catch (error) {
        console.error("Failed to create employee:", error);
        return { success: false, error: "Failed to create employee" };
    }
}
