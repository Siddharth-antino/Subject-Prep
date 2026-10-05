import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';
import { ROOT } from './knowledge/repository.mjs';
export function loadConfig() {
  try {
    loadEnvFile(resolve(ROOT, '.env'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const port = Number(process.env.PREP_PORT || 8788);
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error('PREP_PORT must be between 1024 and 65535.');
  const webPort = Number(process.env.PREP_WEB_PORT || 5174);
  const previewPort = Number(process.env.PREP_PREVIEW_PORT || 4174);
  for (const value of [webPort, previewPort])
    if (!Number.isInteger(value) || value < 1024 || value > 65535)
      throw new Error('Frontend ports must be between 1024 and 65535.');
  if (new Set([port, webPort, previewPort]).size !== 3)
    throw new Error('API, frontend and preview ports must be different.');
  return {
    port,
    webPort,
    previewPort,
    host: '127.0.0.1',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    configured: Boolean(process.env.GEMINI_API_KEY),
    directory: resolve(ROOT, process.env.PREP_STORAGE_DIR || '.sessions'),
    mongoUri: process.env.MONGODB_URI?.trim() || '',
    mongoDatabase: process.env.MONGODB_DB || 'subject_prep',
    mongoCollection: process.env.MONGODB_COLLECTION || 'preparation_sessions',
    learnerId: process.env.MONGODB_LEARNER_ID || 'local',
    allowedOrigins: new Set([
      `http://localhost:${webPort}`,
      `http://127.0.0.1:${webPort}`,
      `http://localhost:${previewPort}`,
      `http://127.0.0.1:${previewPort}`,
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
    ]),
  };
}
