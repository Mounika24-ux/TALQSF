const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  user: String,
  filename: String, // can be "text" if user typed input
  summary: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Summary', summarySchema);
