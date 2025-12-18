import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";

// Import env first to validate environment variables on startup
import { CLIENT_HOST, BETTER_AUTH_URL, IS_PRODUCTION } from "./utils/env";
import connectDatabases from "./lib/database";
import docs from "./docs/route";
import ResponseUtil from "./utils/response";
import { apiLimiter } from "./middlewares/rate-limit.middleware";

const app = express();
const PORT = 3000;

// Initialize database connection
let dbInitialized = false;
async function initDatabase() {
  if (!dbInitialized) {
    try {
      const result = await connectDatabases();
      console.log("✅", result);
      dbInitialized = true;
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  }
}

// CORS configuration
app.use(
  cors({
    origin: [CLIENT_HOST, BETTER_AUTH_URL],
    credentials: true, // Important for better-auth cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Initialize database on first request
app.use(async (_req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database initialization failed" });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  ResponseUtil.success(res, 200, "Server is running");
});

// Documentation routes
docs(app);

// Your API routes (includes better-auth routes)
app.use("/api", router);

// 404 handler - must be after all routes
app.use((req, res, _next) => {
  ResponseUtil.error(res, 404, "Route not found", {
    path: req.path,
    method: req.method,
  });
});

// Global error handler - must be last
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("❌ Unhandled error:", err);

    // Don't leak error details in production
    const errorMessage = IS_PRODUCTION
      ? "Internal server error"
      : err.message || "Internal server error";

    const errorData = IS_PRODUCTION ? null : { stack: err.stack, details: err };

    ResponseUtil.error(res, err.statusCode || 500, errorMessage, errorData);
  }
);

// For local development
if (!IS_PRODUCTION) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    console.log(`🛡️  Rate limiting: Enabled`);
  });
}

// Export for Vercel serverless
export default app;
