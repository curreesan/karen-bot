import { db } from "../db";
import { moderationLogs, offenses } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";

const BAN_THRESHOLD = 15;

async function insertLog(data: {
  discordId: string;
  username: string;
  message: string;
  category: string;
  severity: string;
  reason: string;
  action: string;
  guildId: string;
  channelId: string;
}) {
  await db.insert(moderationLogs).values(data);
}

async function upsertOffense(discordId: string, username: string) {
  const [updated] = await db
    .update(offenses)
    .set({
      count: sql`${offenses.count} + 1`,
      lastOffenseAt: new Date(),
      username,
      shouldBeBanned: sql`(${offenses.count} + 1) >= ${BAN_THRESHOLD}`,
    })
    .where(eq(offenses.discordId, discordId))
    .returning({ count: offenses.count });

  if (updated) return updated.count;

  await db.insert(offenses).values({ discordId, username, count: 1 });
  return 1;
}

async function getAllLogs() {
  return await db
    .select()
    .from(moderationLogs)
    .orderBy(desc(moderationLogs.createdAt));
}

async function getAllOffenses() {
  return await db.select().from(offenses).orderBy(desc(offenses.count));
}

export { insertLog, upsertOffense, getAllLogs, getAllOffenses };
