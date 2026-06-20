import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { DATABASE_URL } from "../utils/env.js";

// Lazy initialization for serverless
let mongoClient: MongoClient | null = null;
let isMongooseConnected = false;
let isMongoClientConnected = false;

// Keep your existing Mongoose connection function (with reuse logic)
export const connectMongoose = async () => {
  try {
    // Reuse existing connection in serverless environment
    if (isMongooseConnected && mongoose.connection.readyState === 1) {
      console.log("♻️ Reusing existing Mongoose connection");
      return Promise.resolve("Mongoose connected (reused)");
    }

    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara",
      // Serverless optimizations
      maxPoolSize: 10,
      minPoolSize: 1,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });

    isMongooseConnected = true;
    return Promise.resolve("Mongoose connected");
  } catch (error) {
    isMongooseConnected = false;
    console.error("Mongoose connection error:", error);
    return Promise.reject(error);
  }
};

// Initialize MongoDB client for better-auth (with reuse logic)
export const connectMongoDB = async () => {
  try {
    // Lazy instantiation
    if (!mongoClient) {
      mongoClient = new MongoClient(DATABASE_URL, {
        maxPoolSize: 10,
        minPoolSize: 1,
      });
    }

    // Reuse existing connection
    if (isMongoClientConnected) {
      console.log("♻️ Reusing existing MongoDB client connection");
      return Promise.resolve("MongoDB client connected (reused)");
    }

    await mongoClient.connect();
    isMongoClientConnected = true;
    return Promise.resolve("MongoDB client connected");
  } catch (error) {
    isMongoClientConnected = false;
    console.error("MongoDB client connection error:", error);
    return Promise.reject(error);
  }
};

// Combined connection function with reuse
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
