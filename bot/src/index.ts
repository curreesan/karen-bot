import { Client, GatewayIntentBits, Message, TextChannel } from "discord.js";
import dotenv from "dotenv";
import { analyzeMessage } from "./moderator";

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

      if (result.severity === "high") {
        await message.delete();
        await channel.send(
          `🚫 **${message.author.username}**, your message was deleted. Reason: ${result.reason}`,
        );
      } else if (result.severity === "medium") {
        await channel.send(
          `⚠️ <@&${process.env.MODERATOR_ROLE_ID}> heads up — **${message.author.username}** sent a flagged message. Category: ${result.category}. Reason: ${result.reason}`,
        );
      } else if (result.severity === "low") {
        console.log(
          `📝 Low severity ignored for ${message.author.username}: ${result.reason}`,
        );
      }
    } catch (err) {
      console.error("❌ Could not moderate (likely owner/admin):", err);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
