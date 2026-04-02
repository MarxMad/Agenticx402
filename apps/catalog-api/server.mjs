import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const catalogPath = path.join(root, "catalog/services.json");

function loadCatalog() {
  const raw = fs.readFileSync(catalogPath, "utf8");
  return JSON.parse(raw);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, service: "agenticx402-catalog" }));
      return;
    }

    if (req.method === "GET" && (req.url === "/services" || req.url === "/api/services")) {
      const catalog = loadCatalog();
      res.writeHead(200);
      res.end(JSON.stringify(catalog));
      return;
    }

    const serviceMatch = req.method === "GET" && req.url?.match(/^\/(?:api\/)?services\/([^/]+)\/?$/);
    if (serviceMatch) {
      const id = decodeURIComponent(serviceMatch[1]);
      const catalog = loadCatalog();
      const found = catalog.services?.find((s) => s.id === id);
      if (!found) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "not_found", id }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(found));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: "internal", message: String(e.message) }));
  }
});

const port = Number(process.env.PORT) || 3840;
server.listen(port, () => {
  console.error(`Catálogo: http://127.0.0.1:${port}/services`);
});
