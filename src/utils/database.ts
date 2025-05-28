import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara",
    });

    return Promise.resolve("Database connect");
  } catch (error) {
    await mongoose.disconnect();
    return Promise.reject(error);
  }
};

export default connect;
