import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: {
    discordId: string;
    username: string;
    avatar: string | null;
  };
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Missing auth token" });
    return;
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AuthedRequest["user"];
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireBotKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-bot-key"];

  if (!key || key !== process.env.BOT_API_KEY) {
    res.status(401).json({ error: "Invalid bot key" });
    return;
  }

  next();
}

export { requireAuth, requireBotKey };
