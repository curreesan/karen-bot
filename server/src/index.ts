import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express from "express";
import cors from "cors";
import { logsRouter } from "./routes/logRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Karen server is running 🚀" });
});

app.use("/api/logs", logsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
