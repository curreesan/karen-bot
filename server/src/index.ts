import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import { logsRouter } from "./routes/logRoutes";
import { authRouter } from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/logs", logsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "Karen server is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
