const { connectDB } = require("./src/lib/mongodb.js");
const Job = require("./src/models/Job.js");

async function createTestJob() {
  try {
    await connectDB();
    
    const testJob = await Job.create({
      jobId: `TEST-${Date.now()}`,
      start: 1000,
      end: 1002,
      baseUrl: "https://emis.gov.eg",
      status: "pending",
    });
    
    console.log("✅ Test job created:", testJob);
    
    // Immediately check if we can find it
    const foundJob = await Job.findOne({ status: "pending" });
    console.log("🔍 Found pending job:", foundJob);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createTestJob();
