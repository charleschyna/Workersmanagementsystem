const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create initial Manager account
    const manager = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'admin123',
            role: 'MANAGER',
        },
    });

    console.log('Initial setup completed!');
    console.log('Manager credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nPlease change these credentials after first login!');
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
