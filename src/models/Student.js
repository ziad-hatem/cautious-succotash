const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  jobId: String,
  imgUrl: String,
  faculty: String,
  division: String,
  level: String,
  year: String,
  semester: String,
  email: String,
  barcode: String,
}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model("Student", StudentSchema);
