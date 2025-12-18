import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import fs from "fs";
import path from "path";
import { docsLimiter } from "../middlewares/rate-limit.middleware";

export default function docs(app: Express) {
  const css = fs.readFileSync(
    path.resolve(
      __dirname,
      "../../node_modules/swagger-ui-dist/swagger-ui.css"
    ),
    "utf-8"
  );

  app.use(
    "/api-docs",
    docsLimiter, // Apply lenient rate limiting to docs
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCss: css,
    })
  );
}
