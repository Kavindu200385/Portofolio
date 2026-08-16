// Local-only dev server that runs the real api/[...path].ts handler directly,
// without needing the Vercel CLI or a linked Vercel account.
// Usage: npx tsx scripts/dev-api-server.mjs  (loads ../../.env and ../.env)
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

// frontend/.env (repo convention) and repo-root/.env, if present
loadEnvFile(path.join(__dirname, "..", ".env"));
loadEnvFile(path.join(__dirname, "..", "..", ".env"));

const handlerModule = await import(path.join(__dirname, "..", "..", "api", "[...path].ts"));
const handler = handlerModule.default;

const PORT = 3000;

createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  let parsedBody;
  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }
  }

  const vercelReq = Object.assign(req, { body: parsedBody });
  const vercelRes = Object.assign(res, {
    status(code) {
      res.statusCode = code;
      return vercelRes;
    },
    json(payload) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(payload));
      return vercelRes;
    },
    setHeader: res.setHeader.bind(res),
  });

  try {
    await handler(vercelReq, vercelRes);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err?.message || "Server error" }));
    }
  }
}).listen(PORT, () => {
  console.log(`Local API dev server (no Vercel CLI needed) listening on http://127.0.0.1:${PORT}`);
});
