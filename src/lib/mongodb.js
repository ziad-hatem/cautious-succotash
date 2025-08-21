const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://ziadhatem2022:NgWqRtxXzBevaX6d@cluster0.l9oi1xv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("🔗 MongoDB URI:", MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log(
        "🟢 MongoDB already connected to:",
        mongoose.connection.db.databaseName
      );
      return mongoose.connection;
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log(
      "🟢 MongoDB connected successfully to:",
      conn.connection.db.databaseName
    );
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectDB };
