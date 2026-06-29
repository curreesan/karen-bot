import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL);

const client = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export const db = drizzle(client, { schema });
