import { ModerationResult } from "./moderator";

const API_URL = process.env.API_URL || "http://localhost:3001";

async function saveModerationLog(
  discordId: string,
  username: string,
  message: string,
  result: ModerationResult,
  action: string,
  guildId: string,
  channelId: string,
) {
  try {
    await fetch(`${API_URL}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discordId,
        username,
        message,
        category: result.category,
        severity: result.severity,
        reason: result.reason,
        action,
        guildId,
        channelId,
      }),
    });
    console.log(`💾 Log saved for ${username}`);
  } catch (err) {
    console.error("❌ Failed to save log to server:", err);
  }
}

export { saveModerationLog };
