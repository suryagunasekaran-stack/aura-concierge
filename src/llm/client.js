import OpenAI from "openai";
import { requireApiKey } from "../config.js";

let client;

export function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({ apiKey: requireApiKey() });
  }
  return client;
}
