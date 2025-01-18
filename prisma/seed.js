import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Ensure "ROLE_USER" authority exists
  const roleUser = await prisma.authority.upsert({
    where: { authorityId: 1 },
    update: {},
    create: {
      authorityId: 1,
      authorityName: 'ROLE_USER',
    },
  });

  console.log('Seed completed:', roleUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
