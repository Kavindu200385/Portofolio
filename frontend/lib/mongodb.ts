import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/** Stay under Vercel Hobby ~10s function limit so we return JSON instead of FUNCTION_INVOCATION_FAILED. */
const CONNECT_OPTS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 45000,
} as const;

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const g = globalThis as typeof globalThis & { mongoose?: Cached };

let cached: Cached = g.mongoose || { conn: null, promise: null };
if (!g.mongoose) g.mongoose = cached;

function clearCache() {
  cached.conn = null;
  cached.promise = null;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch {
      clearCache();
    }
  }

  try {
    cached.promise = mongoose.connect(MONGODB_URI, CONNECT_OPTS);
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    clearCache();
    const msg = e instanceof Error ? e.message : String(e);
    const hint =
      MONGODB_URI.includes("@") && (MONGODB_URI.match(/@/g) || []).length > 1
        ? " Your password may contain @ or other symbols: URL-encode them in MONGODB_URI (e.g. @ → %40)."
        : "";
    throw new Error(`${msg}${hint}`);
  }
}
