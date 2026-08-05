import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const RETRY_COOLDOWN_MS = 30_000;

let connectionPromise: Promise<typeof mongoose> | null = null;
let retryAfter = 0;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (Date.now() < retryAfter) {
    throw new Error("MongoDB is temporarily unavailable");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 800,
      connectTimeoutMS: 800,
    });
  }

  try {
    await connectionPromise;
    retryAfter = 0;
  } catch (error) {
    retryAfter = Date.now() + RETRY_COOLDOWN_MS;
    throw error;
  } finally {
    connectionPromise = null;
  }
}
