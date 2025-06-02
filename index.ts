import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";

// ✅ Add .js to all local imports
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

app.use(express.static("client/dist"));
app.use("/static-site", express.static("static-site"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

    log(logLine.length > 100 ? logLine.slice(0, 99) + "…" : logLine);
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
    log(`❌ ${err.message}`);
  });

  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }

  const server = createServer(app);
  const port = 5001;

  // ✅ Use "localhost" to avoid ENOTSUP on Windows
  server.listen(port, "localhost", () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();
