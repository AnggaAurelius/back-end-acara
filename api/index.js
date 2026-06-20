// Vercel serverless function entry point
// This uses dynamic import to handle the better-auth ES module

module.exports = async (req, res) => {
  try {
    // Import Express app (handles TS compilation automatically)
    const appModule = await import("../src/index.ts");
    const app = appModule.default;

    // Call the Express app
    return app(req, res);
  } catch (error) {
    console.error("❌ Function invocation error:", error);

    return res.status(500).json({
      success: false,
      error: "Server failed to start",
      message: error.message,
      stack: error.stack,
    });
  }
};
