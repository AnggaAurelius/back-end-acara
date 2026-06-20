// Vercel serverless function entry point
// This re-exports the Express app from src/index.ts

// Wrap in try-catch to see any module loading errors
try {
  const app = require("../src/index").default;
  module.exports = app;
} catch (error) {
  console.error("❌ Failed to load Express app:", error);

  // Export an error handler if app fails to load
  module.exports = (req: any, res: any) => {
    res.status(500).json({
      success: false,
      error: "Failed to initialize server",
      message: String(error),
      stack: (error as Error).stack,
    });
  };
}
