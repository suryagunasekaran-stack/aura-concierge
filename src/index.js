import express from "express";
import { PORT, requireApiKey } from "./config.js";
import { processMessage } from "./pipeline.js";
import { logger } from "./util/logger.js";

requireApiKey();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "aura-concierge" });
});

app.post("/message", async (req, res) => {
  try {
    const sessionId = req.body?.sessionId;
    const text = req.body?.text;
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "sessionId is required" });
    }
    if (typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }
    const result = await processMessage(sessionId, text);
    return res.json(result);
  } catch (err) {
    logger.error("POST /message failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.listen(PORT, () => {
  logger.info(`Aura concierge listening on http://localhost:${PORT}`);
});
