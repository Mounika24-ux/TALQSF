const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  user: String,
  filename: String, // can be "text" if user entered custom text
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QA', qaSchema);
