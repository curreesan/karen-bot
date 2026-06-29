import { Router } from "express";
import { createLog, getLogs, getOffenses } from "../controllers/logController";

const router = Router();

router.post("/", createLog);
router.get("/", getLogs);
router.get("/offenses", getOffenses);

export { router as logsRouter };
