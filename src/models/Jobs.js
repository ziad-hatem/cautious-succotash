const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.models.Job || mongoose.model("Job", JobSchema);
