const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all data from the database...');
    
    // Delete in order to respect foreign key constraints
    await prisma.taskClaim.deleteMany({});
    console.log('✓ Cleared all task claims');
    
    await prisma.workAccount.deleteMany({});
    console.log('✓ Cleared all work accounts');
    
    await prisma.user.deleteMany({});
    console.log('✓ Cleared all users');
    
    console.log('\n✅ Database cleared successfully!');
    console.log('You can now create a new manager account or run the seed script.');
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
