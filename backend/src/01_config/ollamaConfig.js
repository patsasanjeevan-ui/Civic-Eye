import { Ollama } from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_GEMMA_MODEL || 'gemma4:e4b';

// Initialize the official Ollama client
export const ollamaClient = new Ollama({
  host: OLLAMA_HOST
});

/**
 * Perform active health check on local Ollama service
 * Returns online status, available models, and active model configuration
 */
export async function checkOllamaHealth() {
  try {
    // 3-second timeout guard
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const modelList = await ollamaClient.list();
    clearTimeout(timeoutId);

    const availableModels = (modelList.models || []).map((m) => m.name);
    const hasDefaultModel = availableModels.some(
      (name) => name.toLowerCase().includes('gemma') || name === DEFAULT_MODEL
    );

    return {
      isOnline: true,
      host: OLLAMA_HOST,
      availableModels,
      defaultModel: DEFAULT_MODEL,
      hasGemma4: hasDefaultModel,
      message: hasDefaultModel
        ? 'Ollama is online with Gemma 4 loaded.'
        : `Ollama is online. Recommended: run 'ollama pull ${DEFAULT_MODEL}'.`
    };
  } catch (error) {
    return {
      isOnline: false,
      host: OLLAMA_HOST,
      availableModels: [],
      defaultModel: DEFAULT_MODEL,
      hasGemma4: false,
      message: `Local Ollama instance not detected at ${OLLAMA_HOST}. Autonomous local simulation engine active. (${error.message})`
    };
  }
}

export function getOllamaClient() {
  return ollamaClient;
}
