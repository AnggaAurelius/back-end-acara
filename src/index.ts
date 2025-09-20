import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";

import db from "./utils/database";
import docs from "./docs/route";
import ResponseUtil from "./utils/response";
const PORT = 3000;

async function init() {
  try {
    const result = await db();
    console.log(result);

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      ResponseUtil.success(res, 200, "Server is running");
    });

    docs(app);
    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
