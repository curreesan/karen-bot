import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { logsRouter } from "./routes/logRoutes";
import { authRouter } from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Dashboard connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Dashboard disconnected: ${socket.id}`);
  });
});

export { io };

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRouter);
app.use("/api/logs", logsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "Karen server is running 🚀" });
});

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
