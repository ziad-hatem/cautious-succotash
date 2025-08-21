const { connectDB } = require("./src/lib/mongodb.js");
const Job = require("./src/models/Job.js");

async function checkDB() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
    
    // Check the connection details
    const mongoose = require('mongoose');
    console.log("🔗 Database name:", mongoose.connection.db.databaseName);
    console.log("🔗 Collection name:", Job.collection.name);
    console.log("🔗 Connection state:", mongoose.connection.readyState);
    
    // List all jobs
    const allJobs = await Job.find({});
    console.log("📊 Total jobs in database:", allJobs.length);
    
    allJobs.forEach(job => {
      console.log(`📄 Job: ${job.jobId}, Status: ${job.status}, Start: ${job.start}, End: ${job.end}`);
    });
    
    // Check pending jobs specifically
    const pendingJobs = await Job.find({ status: "pending" });
    console.log("⏳ Pending jobs:", pendingJobs.length);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkDB();
