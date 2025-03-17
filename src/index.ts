import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";

import db from "./utils/database";
import docs from "./docs/route";
const PORT = 3000;

async function init() {
  try {
    const result = await db();
    console.log(result);

    const app = express();
    docs(app);

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
