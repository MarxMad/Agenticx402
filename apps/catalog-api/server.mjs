import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const catalogPath = path.join(root, "catalog/services.json");
const webRoot = path.join(root, "apps/catalog-web");

function loadCatalog() {
  const raw = fs.readFileSync(catalogPath, "utf8");
  return JSON.parse(raw);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const host = req.headers.host || "127.0.0.1";
    const url = new URL(req.url || "/", `http://${host}`);
    const p = url.pathname;

    if (req.method === "GET" && p === "/health") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, service: "agenticx402-catalog" }));
      return;
    }

    if (req.method === "GET" && p === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "GET" && p === "/") {
      const indexPath = path.join(webRoot, "index.html");
      const html = fs.readFileSync(indexPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (req.method === "GET" && (p === "/services" || p === "/api/services")) {
      const catalog = loadCatalog();
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(catalog));
      return;
    }

    const serviceMatch = req.method === "GET" && p.match(/^\/(?:api\/)?services\/([^/]+)\/?$/);
    if (serviceMatch) {
      const id = decodeURIComponent(serviceMatch[1]);
      const catalog = loadCatalog();
      const found = catalog.services?.find((s) => s.id === id);
      if (!found) {
        res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "not_found", id }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(found));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "internal", message: String(e.message) }));
  }
});

const port = Number(process.env.PORT) || 3840;

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Puerto ${port} en uso. Cierra la otra instancia (p. ej. otra terminal con catalog:dev) o usa otro puerto:\n` +
        `  PORT=3841 npm run catalog:dev\n` +
        `Para ver qué proceso usa el puerto: lsof -nP -iTCP:${port} -sTCP:LISTEN`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(port, () => {
  console.error(`Hub:   http://127.0.0.1:${port}/`);
  console.error(`API:   http://127.0.0.1:${port}/services`);
  console.error(`Salud: http://127.0.0.1:${port}/health`);
});
