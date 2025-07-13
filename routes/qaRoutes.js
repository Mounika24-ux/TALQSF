const express = require('express');
const router = express.Router();
const QA = require('../models/QA');

router.post("/", async (req, res) => {
  const { user, filename, question, answer } = req.body;

  try {
    const newQA = new QA({ user, filename, question, answer });
    await newQA.save();
    res.status(201).json({ message: "Q&A saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:user", async (req, res) => {
  const { user } = req.params;
  const qa = await QA.find({ user }).sort({ createdAt: -1 });
  res.json(qa);
});
router.delete("/item/:id", async (req, res) => {
  try {
    await QA.findByIdAndDelete(req.params.id);
    res.json({ message: "Q&A deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE all Q&A for a user
router.delete("/:user", async (req, res) => {
  const { user } = req.params;
  try {
    await QA.deleteMany({ user });
    res.json({ message: "All Q&A deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
