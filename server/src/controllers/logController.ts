import { Request, Response } from "express";
import {
  insertLog,
  upsertOffense,
  getAllLogs,
  getAllOffenses,
} from "../models/logModel";
import { io } from "../index";

async function createLog(req: Request, res: Response) {
  try {
    const {
      discordId,
      username,
      message,
      category,
      severity,
      reason,
      action,
      guildId,
      channelId,
    } = req.body;

    await insertLog({
      discordId,
      username,
      message,
      category,
      severity,
      reason,
      action,
      guildId,
      channelId,
    });

    const offenseCount = await upsertOffense(discordId, username);
    console.log(`📝 ${username} now has ${offenseCount} offense(s)`);

    if (offenseCount >= 15) {
      console.log(`🚨 ${username} hit 15 offenses — flag for ban!`);
    }

    // Broadcast new log to all connected dashboards
    io.emit("new_log", {
      discordId,
      username,
      message,
      category,
      severity,
      reason,
      action,
      guildId,
      channelId,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, offenseCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save log" });
  }
}

async function getLogs(req: Request, res: Response) {
  try {
    const logs = await getAllLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

async function getOffenses(req: Request, res: Response) {
  try {
    const data = await getAllOffenses();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch offenses" });
  }
}

export { createLog, getLogs, getOffenses };
