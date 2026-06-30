# 👮 Karen — AI-Powered Discord Moderation Bot

Karen is an intelligent Discord moderation system that uses AI to detect and act on toxic, abusive, or harmful messages in real time. It pairs an LLM-driven moderation engine with a full web dashboard so server admins can monitor activity, track repeat offenders, and review moderation history.

🔗 **Live Dashboard:** [karen-bot-client.vercel.app](https://karen-bot-client.vercel.app)
🔗 **Live API:** [karen-bot-server.onrender.com](https://karen-bot-server.onrender.com)

> Note: The Discord bot's AI moderation runs on a local LLM (Ollama + Llama 3.2), so live message moderation is only active when the bot is running locally. The dashboard and API are fully live and browsable at all times.

## Overview

Most Discord moderation bots rely on keyword blacklists, which are easy to bypass and miss context entirely. Karen instead uses a large language model to analyze each message for intent and context, classifying it by category (hate speech, harassment, spam, NSFW) and severity (low, medium, high) before deciding how to respond — ignore, flag for a human moderator, or delete and warn.

Every moderation decision is logged to a database, and repeat offenders are tracked automatically, with a threshold-based flag for users who accumulate too many violations.

## Features

- **Real-time message monitoring** across Discord servers via Discord.js
- **AI-based content analysis** using a locally-run LLM (Ollama running Llama 3.2), with a structured system prompt covering hate speech, harassment, spam, and NSFW detection
- **Severity-based moderation actions**
  - High severity → message deleted, user warned
  - Medium severity → message flagged to the moderator role
  - Low severity → logged silently for review
- **Offense tracking** — repeat violations are counted per user, with automatic flagging at a configurable threshold
- **Discord OAuth login** for the moderator dashboard, so only authorized moderators can view logs
- **Live-updating web dashboard** — stats, recent moderation activity, and a leaderboard of top offenders update in real time via WebSockets, no manual refresh needed
- **Full moderation history** with search and filtering by category, severity, and username

## Tech Stack

**Bot**

- Node.js, TypeScript
- Discord.js
- Ollama (Llama 3.2) for local, free AI inference

**Backend**

- Node.js, Express, TypeScript
- MVC architecture (routes → controllers → models)
- PostgreSQL (hosted on Neon)
- Drizzle ORM
- Discord OAuth 2.0 + JWT authentication
- Socket.io for real-time event broadcasting
- Deployed on Render

**Frontend**

- React + TypeScript
- React Router
- Context API for auth state
- Socket.io client for live dashboard updates
- Plain CSS, organized per-page
- Deployed on Vercel

## How It Works

1. A message is sent in a connected Discord server.
2. The bot sends the message content to a local Llama 3.2 model via Ollama, using a detailed moderation prompt covering categories, severity rules, and edge cases (coded language, bypass attempts, self-harm content, etc.).
3. Based on the AI's classification, the bot takes action: delete + warn, flag to moderators, or silently log.
4. The result is sent to the live Express API and saved to PostgreSQL, along with an updated offense count for the user.
5. The server broadcasts the new moderation event over a WebSocket connection, so any moderator with the dashboard open sees it appear instantly — no page refresh required.
6. Moderators log in to the dashboard via Discord OAuth and can view stats, recent logs, and a list of repeat offenders, all updating live as new events come in.

## Project Structure

```
karen-bot/
├── bot/        # Discord bot + AI moderation logic
├── server/     # Express API, MVC structure, database layer, WebSocket server
└── client/     # React moderator dashboard with live updates
```
