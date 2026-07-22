import { MAX_TRAINING_BYTES } from "../config.js";
import { isDbConfigured, query } from "../db/client.js";
import { logger } from "../util/logger.js";

/**
 * @returns {Promise<{ id: number, filename: string, content: string, byte_size: number, created_at: Date }[]>}
 */
export async function listTrainingDocumentsFull() {
  if (!isDbConfigured()) return [];
  try {
    const result = await query(
      `SELECT id, filename, content, byte_size, created_at
       FROM training_documents
       ORDER BY created_at ASC`
    );
    return result.rows;
  } catch (err) {
    logger.error("Failed to load training documents:", err);
    return [];
  }
}

/**
 * @returns {Promise<{ id: number, filename: string, byte_size: number, created_at: Date }[]>}
 */
export async function listTrainingDocumentsMeta() {
  const result = await query(
    `SELECT id, filename, byte_size, created_at
     FROM training_documents
     ORDER BY created_at DESC`
  );
  return result.rows;
}

/**
 * Build a system-prompt appendix from all uploaded docs.
 * @param {{ filename: string, content: string }[]} docs
 * @returns {string}
 */
export function buildKnowledgeBlock(docs) {
  if (!docs || docs.length === 0) return "";

  const parts = docs.map(
    (doc) => `--- ${doc.filename} ---\n${doc.content.trim()}`
  );

  return [
    "",
    "## ADDITIONAL CLINIC KNOWLEDGE (uploaded training data) — HIGHEST PRIORITY",
    "This section is live training data uploaded by clinic staff. You MUST follow these rules:",
    "1. For preparation, aftercare, downtime, or post-treatment questions: answer from this section when the topic matches — even if get_faq returns not_found.",
    "2. If get_faq returns ok:false or not_found, search this section BEFORE saying you cannot help or offering a consultation.",
    "3. Only suggest a consultation if BOTH tools and this section lack relevant information.",
    "4. Paraphrase from this text only — do not invent details beyond it.",
    ...parts,
  ].join("\n\n");
}

/**
 * @param {string} filename
 * @param {string} content
 */
export async function createTrainingDocument(filename, content) {
  const safeName =
    typeof filename === "string" && filename.trim()
      ? filename.trim().slice(0, 200)
      : "upload.txt";
  const text = typeof content === "string" ? content : "";
  const byteSize = Buffer.byteLength(text, "utf8");

  if (!text.trim()) {
    const err = new Error("content is required");
    err.status = 400;
    throw err;
  }
  if (byteSize > MAX_TRAINING_BYTES) {
    const err = new Error(
      `File too large — max ${MAX_TRAINING_BYTES} bytes (${Math.floor(MAX_TRAINING_BYTES / 1024)}KB)`
    );
    err.status = 400;
    throw err;
  }
  if (!safeName.toLowerCase().endsWith(".txt") && !/\.txt$/i.test(safeName)) {
    // Allow non-.txt names if content is plain text, but prefer .txt
  }

  const result = await query(
    `INSERT INTO training_documents (filename, content, byte_size)
     VALUES ($1, $2, $3)
     RETURNING id, filename, byte_size, created_at`,
    [safeName, text, byteSize]
  );
  return result.rows[0];
}

export async function deleteAllTrainingDocuments() {
  const result = await query(`DELETE FROM training_documents RETURNING id`);
  return { deleted: result.rowCount ?? 0 };
}

/**
 * @param {number|string} id
 */
export async function deleteTrainingDocument(id) {
  const result = await query(
    `DELETE FROM training_documents WHERE id = $1 RETURNING id`,
    [id]
  );
  return { deleted: result.rowCount ?? 0 };
}
