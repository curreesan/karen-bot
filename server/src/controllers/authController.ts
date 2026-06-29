import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const DISCORD_API = "https://discord.com/api/v10";

async function login(req: Request, res: Response) {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    response_type: "code",
    scope: "identify guilds.members.read",
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}

async function callback(req: Request, res: Response) {
  const { code } = req.query;

  if (!code) {
    res.status(400).json({ error: "No code provided" });
    return;
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenRes.json();

    // Get user info from Discord
    const userRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();

    // Create JWT
    const token = jwt.sign(
      {
        discordId: user.id,
        username: user.username,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth failed" });
  }
}

export { login, callback };
