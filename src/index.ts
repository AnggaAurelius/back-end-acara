import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";

import connectDatabases from "./lib/database";
import docs from "./docs/route";
import ResponseUtil from "./utils/response";

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
    origin: [
      process.env.CLIENT_HOST || "http://localhost:3001",
      process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ],
    credentials: true, // Important for better-auth cookies
  })
);

app.use(bodyParser.json());

// Initialize database on first request
app.use(async (req, res, next) => {
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

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  });
}

// Export for Vercel serverless
export default app;
