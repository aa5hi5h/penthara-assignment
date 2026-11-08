import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || "leave-management-dev-secret",
  databaseUrl: process.env.DATABASE_URL || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoPort: Number(process.env.MONGO_PORT) || 27018,
};
