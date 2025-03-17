import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";

import db from "./utils/database";

async function init() {
  try {
    const result = await db();
    console.log(result);

    const app = express();

    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api", router);

    const PORT = 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
