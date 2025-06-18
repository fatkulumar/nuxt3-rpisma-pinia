import { PrismaClient } from '~/generated/prisma'
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
    const user = await prisma.users.create({
        data: {
            name: 'Alice',
            email: 'alice@prisma.io',
        },
    })
    console.log(user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })