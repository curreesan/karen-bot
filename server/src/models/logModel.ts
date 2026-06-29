import { db } from "../db";
import { moderationLogs, offenses } from "../db/schema";
import { eq, desc } from "drizzle-orm";

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
  const existing = await db.query.offenses.findFirst({
    where: eq(offenses.discordId, discordId),
  });

  if (existing) {
    await db
      .update(offenses)
      .set({ count: existing.count + 1, lastOffenseAt: new Date(), username })
      .where(eq(offenses.discordId, discordId));
    return existing.count + 1;
  } else {
    await db.insert(offenses).values({ discordId, username, count: 1 });
    return 1;
  }
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
