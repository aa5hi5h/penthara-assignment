import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { env } from "./env.js";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const replicaSetName = "rs0";
const databaseName = "leave_management";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function initiateReplicaSet(port) {
  const client = new MongoClient(`mongodb://127.0.0.1:${port}/?directConnection=true`);
  await client.connect();
  const admin = client.db("admin");

  try {
    await admin.command({
      replSetInitiate: {
        _id: replicaSetName,
        members: [{ _id: 0, host: `127.0.0.1:${port}` }],
      },
    });
  } catch (error) {
    if (error.codeName !== "AlreadyInitialized") {
      throw error;
    }
  }

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const status = await admin.command({ hello: 1 });
    if (status.isWritablePrimary) {
      break;
    }
    await wait(500);
  }

  await client.close();
}

async function startEmbeddedDatabase() {
  const dbPath = path.join(serverRoot, "data", "db");
  fs.mkdirSync(dbPath, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: env.mongoPort,
      dbPath,
      storageEngine: "wiredTiger",
      replSet: replicaSetName,
    },
  });

  await initiateReplicaSet(env.mongoPort);

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return `mongodb://127.0.0.1:${env.mongoPort}/${databaseName}?replicaSet=${replicaSetName}`;
}

export async function resolveDatabaseUrl() {
  if (env.databaseUrl) {
    return env.databaseUrl;
  }
  console.log("Starting embedded MongoDB (first run downloads the binary)...");
  return startEmbeddedDatabase();
}

export function syncSchema(databaseUrl) {
  execSync("npx prisma db push --skip-generate", {
    cwd: serverRoot,
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
