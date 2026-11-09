import bcrypt from "bcryptjs";

const demoUsers = [
  { name: "Admin User", email: "admin@company.com", password: "admin123", role: "ADMIN", leaveBalance: 20 },
  { name: "Rahul Verma", email: "employee@company.com", password: "employee123", role: "EMPLOYEE", leaveBalance: 17 },
  { name: "Ananya Singh", email: "ananya@company.com", password: "employee123", role: "EMPLOYEE", leaveBalance: 20 },
];

const day = (value) => new Date(`${value}T00:00:00.000Z`);

export async function seedDatabase(prisma) {
  const existing = await prisma.user.count();
  if (existing > 0) {
    return;
  }

  const hashed = await Promise.all(
    demoUsers.map(async (user) => ({ ...user, password: await bcrypt.hash(user.password, 10) })),
  );
  await prisma.user.createMany({ data: hashed });

  const rahul = await prisma.user.findUnique({ where: { email: "employee@company.com" } });
  const ananya = await prisma.user.findUnique({ where: { email: "ananya@company.com" } });

  await prisma.leave.createMany({
    data: [
      {
        userId: rahul.id,
        startDate: day("2026-09-14"),
        endDate: day("2026-09-16"),
        days: 3,
        reason: "Family function out of town",
        status: "APPROVED",
      },
      {
        userId: rahul.id,
        startDate: day("2026-10-05"),
        endDate: day("2026-10-09"),
        days: 5,
        reason: "Extended personal trip",
        status: "REJECTED",
      },
      {
        userId: rahul.id,
        startDate: day("2026-12-21"),
        endDate: day("2026-12-23"),
        days: 3,
        reason: "Year-end vacation",
        status: "PENDING",
      },
      {
        userId: ananya.id,
        startDate: day("2026-11-25"),
        endDate: day("2026-11-26"),
        days: 2,
        reason: "Medical appointment and recovery",
        status: "PENDING",
      },
    ],
  });
}
