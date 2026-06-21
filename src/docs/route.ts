import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json" with { type: "json" };
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { docsLimiter } from "../middlewares/rate-limit.middleware.js";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function docs(app: Express) {
  const css = fs.readFileSync(
    path.resolve(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui.css",
    ),
    "utf-8",
  );

  app.use(
    "/api-docs",
    docsLimiter, // Apply lenient rate limiting to docs
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCss: css,
    }),
  );
}
