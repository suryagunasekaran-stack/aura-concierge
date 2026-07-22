import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is required. Copy .env.example to .env and set a Postgres URL."
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "schema.sql");
const schemaSql = readFileSync(schemaPath, "utf8");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:
    DATABASE_URL.includes("sslmode=require") ||
    DATABASE_URL.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
});

try {
  await pool.query(schemaSql);
  console.log("Migration complete:", schemaPath);
} catch (err) {
  console.error("Migration failed:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
