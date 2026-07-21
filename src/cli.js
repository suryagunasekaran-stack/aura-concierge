import readline from "node:readline";
import { DEFAULT_SESSION_ID, requireApiKey } from "./config.js";
import { processMessage } from "./pipeline.js";
import { logger } from "./util/logger.js";

requireApiKey();

const sessionId = process.env.SESSION_ID || DEFAULT_SESSION_ID;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Aura Aesthetic Clinic — AI Concierge (CLI)");
console.log(`Session: ${sessionId}`);
console.log('Type a message (or "exit" to quit). Reset with: start over / reset / new booking\n');

function prompt() {
  rl.question("You: ", async (line) => {
    const text = line.trim();
    if (!text) {
      prompt();
      return;
    }
    if (["exit", "quit", "q"].includes(text.toLowerCase())) {
      rl.close();
      return;
    }
    try {
      const { reply, toolCalls } = await processMessage(sessionId, text);
      if (toolCalls.length) {
        logger.info(`tools: ${toolCalls.join(", ")}`);
      }
      console.log(`Aura: ${reply}\n`);
    } catch (err) {
      logger.error(err);
      console.log("Aura: Sorry, something went wrong. Please try again.\n");
    }
    prompt();
  });
}

prompt();
