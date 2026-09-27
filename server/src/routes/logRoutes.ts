import { Router } from "express";
import { createLog, getLogs, getOffenses } from "../controllers/logController";
import { requireAuth, requireBotKey } from "../middleware/auth";

const router = Router();

router.post("/", requireBotKey, createLog);
router.get("/", requireAuth, getLogs);
router.get("/offenses", requireAuth, getOffenses);

export { router as logsRouter };
