const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const dummyUsers = [
    {
      email: "ahmad.fauzan@mailtest.com",
      password: "Ahmad123!",
    },
    {
      email: "siti.rahmawati@mailtest.com",
      password: "Siti123!",
    },
    {
      email: "rizky.pratama@mailtest.com",
      password: "Rizky123!",
    },
  ];

  console.log("Start seeding...");

  for (const user of dummyUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const upsertUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: {
        email: user.email,
        password: hashedPassword,
      },
    });
    console.log(`Created/Updated user: ${upsertUser.email}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
