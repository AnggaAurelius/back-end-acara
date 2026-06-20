import express from "express";
import router from "./routes/api.js";
import bodyParser from "body-parser";
import cors from "cors";

// Import env first to validate environment variables on startup
import {
  CLIENT_HOST,
  BETTER_AUTH_URL,
  IS_PRODUCTION,
  validateEnv,
} from "./utils/env.js";
import connectDatabases from "./lib/database.js";
import docs from "./docs/route.js";
import ResponseUtil from "./utils/response.js";
import { apiLimiter } from "./middlewares/rate-limit.middleware.js";

const app = express();
const PORT = 3000;

// Initialize database connection (with lazy loading and reuse)
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
  }),
);

// Apply rate limiting to all routes
app.use(apiLimiter);

// Validate environment variables on first request
let envValidated = false;
app.use((req, res, next) => {
  if (!envValidated) {
    const result = validateEnv();
    if (!result.success) {
      console.error("Environment validation failed:", result.error);
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
        message: IS_PRODUCTION ? "Service unavailable" : result.error,
      });
    }
    envValidated = true;
    console.log("✅ Environment validated");
  }
  next();
});

// Initialize database on first request
app.use(async (_req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (error) {
    console.error("Database initialization error:", error);
    return res.status(500).json({
      success: false,
      error: "Database initialization failed",
      message: IS_PRODUCTION
        ? "Service temporarily unavailable"
        : String(error),
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  ResponseUtil.success(res, 200, "Server is running");
});

// Documentation routes
docs(app);

// Your API routes (includes better-auth routes)
// Better-Auth needs the raw request body, so mount before bodyParser.json()
app.use("/api", router);

// Body parser for non-auth routes (must come after the better-auth handler)
app.use(bodyParser.json());

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
    _next: express.NextFunction,
  ) => {
    console.error("❌ Unhandled error:", err);

    // Don't leak error details in production
    const errorMessage = IS_PRODUCTION
      ? "Internal server error"
      : err.message || "Internal server error";

    const errorData = IS_PRODUCTION ? null : { stack: err.stack, details: err };

    ResponseUtil.error(res, err.statusCode || 500, errorMessage, errorData);
  },
);

// For local development only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    console.log(`🛡️  Rate limiting: Enabled`);
  });
}

// Export for Vercel serverless - this is the critical part!
export default app;
