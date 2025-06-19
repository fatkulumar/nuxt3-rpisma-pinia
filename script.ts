import { PrismaClient } from '~/generated/prisma';
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const users = Array.from({ length: 106 }, (_, i) => {
    const index = i + 1;
    return {
      name: `User ${index}`,
      email: `user${index}@example.com`
    };
  });

  const result = await prisma.users.createMany({
    data: users,
    skipDuplicates: true
  });

  console.log(`Inserted ${result.count} users.`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
