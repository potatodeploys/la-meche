import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
const app = express();
app.use(express.static("client/dist"));
app.use("/static-site", express.static("static-site"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    const start = Date.now();
    let responseBody;
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        responseBody = body;
        return originalJson(body);
    };
    res.on("finish", () => {
        if (!req.path.startsWith("/api"))
            return;
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
    app.use((err, _req, res, _next) => {
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
//# sourceMappingURL=index.js.map