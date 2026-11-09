import { resolveDatabaseUrl, syncSchema } from "./config/database.js";
import { env } from "./config/env.js";

async function main() {
  const databaseUrl = await resolveDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;
  syncSchema(databaseUrl);

  const { prisma } = await import("./lib/prisma.js");
  const { seedDatabase } = await import("./utils/seedDatabase.js");
  const { default: app } = await import("./app.js");

  await seedDatabase(prisma);

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
