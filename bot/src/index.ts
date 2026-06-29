import { Client, GatewayIntentBits, Message, TextChannel } from "discord.js";
import dotenv from "dotenv";
import { analyzeMessage } from "./services/moderator";
import { saveModerationLog } from "./services/api";

dotenv.config({ path: "../.env" });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("clientReady", () => {
  console.log(`✅ Karen is online as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  console.log(`[${message.author.username}]: ${message.content}`);

  const result = await analyzeMessage(message.content);
  console.log(`🔍 Analysis:`, JSON.stringify(result, null, 2));

  if (result.isToxic) {
    try {
      const channel = message.channel as TextChannel;
      let action = "logged";

      if (result.severity === "high") {
        await message.delete();
        await channel.send(
          `🚫 **${message.author.username}**, your message was deleted. Reason: ${result.reason}`,
        );
        action = "deleted";
      } else if (result.severity === "medium") {
        await channel.send(
          `⚠️ <@&${process.env.MODERATOR_ROLE_ID}> heads up — **${message.author.username}** sent a flagged message. Category: ${result.category}. Reason: ${result.reason}`,
        );
        action = "flagged";
      } else if (result.severity === "low") {
        console.log(
          `📝 Low severity ignored for ${message.author.username}: ${result.reason}`,
        );
        action = "logged";
      }

      await saveModerationLog(
        message.author.id,
        message.author.username,
        message.content,
        result,
        action,
        message.guildId!,
        message.channelId,
      );
    } catch (err) {
      console.error("❌ Could not moderate (likely owner/admin):", err);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
