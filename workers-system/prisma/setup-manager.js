const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating initial manager account...\n');
    
    // Create Manager account
    // NOTE: Change the username and password below before running!
    const manager = await prisma.user.create({
        data: {
            username: 'admin',  // Change this to desired username
            password: 'admin123',  // Change this to desired password
            role: 'MANAGER',
        },
    });

    console.log('✅ Manager account created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Username:', manager.username);
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error:', e.message);
        await prisma.$disconnect();
        process.exit(1);
    });
