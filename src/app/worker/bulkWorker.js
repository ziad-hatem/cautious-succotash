const { connectDB } = require("../../lib/mongodb.js");
const Student = require("../../models/Student.js");
const Job = require("../../models/Jobs.js"); // Changed from BulkJob to Job
const { fetchAndScrape } = require("../../lib/scrape.js");

async function runWorker() {
  try {
    await connectDB();
    console.log("✅ Worker connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  while (true) {
    try {
      const job = await Job.findOneAndUpdate(
        // Changed from BulkJob to Job
        { status: "pending" },
        { status: "processing", startedAt: new Date() },
        { new: true }
      );

      console.log(job);

      if (!job) {
        console.log("⏰ No pending jobs, waiting...");
        await new Promise((res) => setTimeout(res, 5000));
        continue;
      }

      console.log(
        `🚀 Starting job ${job.jobId} from ${job.start} to ${job.end}`
      );

      const results = [];

      for (let code = job.start; code <= job.end; code++) {
        console.log(`🔍 Scraping student with code: ${code}`);

        const student = await fetchAndScrape(
          code.toString(),
          "https://id.o6uelearning.com/Home/Search?searchName="
        );

        if (student) {
          try {
            // Add jobId to student for tracking
            const studentData = { ...student, jobId: job.jobId };
            await Student.create(studentData);
            results.push(student);
            console.log(`✅ Found student: ${student.name} (${student.code})`);
          } catch (createError) {
            if (createError.code === 11000) {
              console.log(
                `📝 Student ${student.code} already exists, skipping`
              );
            } else {
              throw createError;
            }
          }
        } else {
          console.log(`❌ No student found for code ${code}`);
        }
      }

      job.status = "done";
      job.results = results.map((s) => s.code);
      job.finishedAt = new Date();
      await job.save();

      console.log(
        `🎉 Job ${job.jobId} finished with ${results.length} students`
      );
    } catch (err) {
      console.error("⚠️ Worker error:", err);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

runWorker().catch((err) => {
  console.error("❌ Fatal worker error:", err);
  process.exit(1);
});
