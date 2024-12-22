import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use("/api", router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
