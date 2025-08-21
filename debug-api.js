// Import the same way your API does
const mongoose = require('mongoose');

// Connect the same way your API should
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-scraper';

async function checkAPIDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ API-style connection successful");
    console.log("🔗 Database name:", mongoose.connection.db.databaseName);
    
    // Use the same model structure as your API
    const JobSchema = new mongoose.Schema({
      jobId: { type: String, unique: true },
      start: Number,
      end: Number,
      baseUrl: String,
      status: {
        type: String,
        enum: ["pending", "processing", "done"],
        default: "pending",
      },
      results: [String],
      startedAt: Date,
      finishedAt: Date,
    }, { timestamps: true });

    const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
    
    console.log("🔗 Collection name:", Job.collection.name);
    
    const allJobs = await Job.find({});
    console.log("📊 Jobs found by API method:", allJobs.length);
    
    allJobs.forEach(job => {
      console.log(`📄 API Job: ${job.jobId}, Status: ${job.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ API Error:", error);
    process.exit(1);
  }
}

checkAPIDB();
