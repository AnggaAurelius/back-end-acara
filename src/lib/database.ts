import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { DATABASE_URL } from "../utils/env";

// MongoDB client for better-auth (separate from Mongoose)
const mongoClient = new MongoClient(DATABASE_URL);

// Keep your existing Mongoose connection function
export const connectMongoose = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara",
    });
    return Promise.resolve("Mongoose connected");
  } catch (error) {
    await mongoose.disconnect();
    return Promise.reject(error);
  }
};

// Initialize MongoDB client for better-auth
export const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
    return Promise.resolve("MongoDB client connected");
  } catch (error) {
    await mongoClient.close();
    return Promise.reject(error);
  }
};

// Combined connection function
export const connectDatabases = async () => {
  try {
    const [mongooseResult, mongoClientResult] = await Promise.all([
      connectMongoose(),
      connectMongoDB(),
    ]);

    console.log("✅", mongooseResult);
    console.log("✅", mongoClientResult);

    return Promise.resolve("All databases connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return Promise.reject(error);
  }
};

// Export default as the combined connection for backward compatibility
export default connectDatabases;
