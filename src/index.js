import express from "express";
import { PORT, requireApiKey, INTENT_LABELS } from "./config.js";
import { processMessage } from "./pipeline.js";
import { logger } from "./util/logger.js";
import { isDbConfigured } from "./db/client.js";
import {
  deleteAllIntentEvents,
  getIntentStats,
  listIntentEvents,
} from "./intent/store.js";
import {
  createTrainingDocument,
  deleteAllTrainingDocuments,
  deleteTrainingDocument,
  listTrainingDocumentsMeta,
} from "./training/store.js";

requireApiKey();

const app = express();
app.use(express.json({ limit: "200kb" }));

function requireDb(res) {
  if (!isDbConfigured()) {
    res.status(503).json({
      error: "database_unavailable",
      message: "DATABASE_URL is not configured",
    });
    return false;
  }
  return true;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "aura-concierge",
    database: isDbConfigured(),
  });
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

app.get("/intents/stats", async (_req, res) => {
  try {
    if (!requireDb(res)) return;
    const stats = await getIntentStats();
    return res.json({ ...stats, labels: INTENT_LABELS });
  } catch (err) {
    logger.error("GET /intents/stats failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.get("/intents", async (req, res) => {
  try {
    if (!requireDb(res)) return;
    const limit = req.query.limit;
    const intent =
      typeof req.query.intent === "string" && req.query.intent
        ? req.query.intent
        : undefined;
    const events = await listIntentEvents({ limit, intent });
    return res.json({ events });
  } catch (err) {
    logger.error("GET /intents failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.delete("/intents", async (_req, res) => {
  try {
    if (!requireDb(res)) return;
    const result = await deleteAllIntentEvents();
    return res.json(result);
  } catch (err) {
    logger.error("DELETE /intents failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.get("/training", async (_req, res) => {
  try {
    if (!requireDb(res)) return;
    const documents = await listTrainingDocumentsMeta();
    return res.json({ documents });
  } catch (err) {
    logger.error("GET /training failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.post("/training", async (req, res) => {
  try {
    if (!requireDb(res)) return;
    const filename = req.body?.filename;
    const content = req.body?.content;
    if (typeof content !== "string") {
      return res.status(400).json({ error: "content is required" });
    }
    const doc = await createTrainingDocument(
      typeof filename === "string" ? filename : "upload.txt",
      content
    );
    return res.status(201).json({ document: doc });
  } catch (err) {
    logger.error("POST /training failed:", err);
    const status = err.status || 500;
    return res.status(status).json({
      error: status === 400 ? "bad_request" : "internal_error",
      message: err.message,
    });
  }
});

app.delete("/training", async (_req, res) => {
  try {
    if (!requireDb(res)) return;
    const result = await deleteAllTrainingDocuments();
    return res.json(result);
  } catch (err) {
    logger.error("DELETE /training failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.delete("/training/:id", async (req, res) => {
  try {
    if (!requireDb(res)) return;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "invalid_id" });
    }
    const result = await deleteTrainingDocument(id);
    if (result.deleted === 0) {
      return res.status(404).json({ error: "not_found" });
    }
    return res.json(result);
  } catch (err) {
    logger.error("DELETE /training/:id failed:", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

app.listen(PORT, () => {
  logger.info(`Aura concierge listening on http://localhost:${PORT}`);
  if (!isDbConfigured()) {
    logger.info(
      "DATABASE_URL not set — intent logging and training APIs are disabled"
    );
  }
});
