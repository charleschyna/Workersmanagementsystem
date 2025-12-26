const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create Manager
    const manager = await prisma.user.upsert({
        where: { username: 'manager' },
        update: {},
        create: {
            username: 'manager',
            password: 'password123',
            role: 'MANAGER',
        },
    });

    // Create Employee 'charles'
    const charles = await prisma.user.upsert({
        where: { username: 'charles' },
        update: {},
        create: {
            username: 'charles',
            password: 'password123',
            role: 'EMPLOYEE',
        },
    });

    // Create Employee 'testuser_verify'
    const testuser = await prisma.user.upsert({
        where: { username: 'testuser_verify' },
        update: {},
        create: {
            username: 'testuser_verify',
            password: 'password123',
            role: 'EMPLOYEE',
        },
    });

    // Create Account 'brownhandshake' assigned to charles
    await prisma.workAccount.create({
        data: {
            accountName: 'brownhandshake',
            email: 'brown@example.com',
            password: 'password123',
            browserType: 'IX Browser',
            status: 'Assigned',
            employeeId: charles.id,
        },
    });

    // Create Account 'TestAccount123' paused by testuser_verify
    await prisma.workAccount.create({
        data: {
            accountName: 'TestAccount123',
            email: 'test@example.com',
            password: 'password123',
            browserType: 'GoLogin',
            status: 'Paused',
            employeeId: testuser.id,
        },
    });

    // Create Pending Claim for charles
    await prisma.taskClaim.create({
        data: {
            employeeId: charles.id,
            platform: 'Handshake',
            accountName: 'brownhandshake',
            taskExternalId: '4834838',
            timeSpentHours: 1.00,
            screenshot: 'placeholder.png',
            status: 'Pending',
        },
    });

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
