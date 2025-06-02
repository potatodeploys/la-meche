// index.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Serve static frontend files (HTML/CSS/JS)
app.use(express.static(path.resolve(__dirname, "client/dist")));

// Optional: serve other static content
app.use("/static-site", express.static("static-site"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ API logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  let responseBody: any;

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (!req.path.startsWith("/api")) return;
    const duration = Date.now() - start;
    let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;

    if (responseBody) {
      const summary = JSON.stringify(responseBody);
      logLine += ` :: ${summary.length > 40 ? summary.slice(0, 40) + "…" : summary}`;
    }

    console.log(logLine.length > 100 ? logLine.slice(0, 99) + "…" : logLine);
  });

  next();
});

(async () => {
  await registerRoutes(app);

  // ✅ Catch-all: serve index.html for frontend routes (SPA or static)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/dist/index.html"));
  });

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
    console.log(`❌ ${err.message}`);
  });

  const server = createServer(app);
  const port = 5001;

  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
