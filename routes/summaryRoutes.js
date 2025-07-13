const express = require("express");
const router = express.Router();
const Summary = require("../models/Summary");

router.post("/", async (req, res) => {
  const { user, filename, summary } = req.body;

  if (!user || !filename || !summary) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newSummary = new Summary({ user, filename, summary });
    await newSummary.save();
    console.log("✅ Summary saved to MongoDB:", newSummary);
    res.status(201).json({ message: "Summary saved successfully" });
  } catch (err) {
    console.error("❌ Error saving summary:", err.message);
    res.status(500).json({ error: "Failed to save summary" });
  }
});
router.get("/:user", async (req, res) => {
  const { user } = req.params;
  const summaries = await Summary.find({ user }).sort({ createdAt: -1 });
  res.json(summaries);
}); 
router.delete("/item/:id", async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: "Summary deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE all summaries for a user
router.delete("/:user", async (req, res) => {
  const { user } = req.params;
  try {
    await Summary.deleteMany({ user });
    res.json({ message: "All summaries deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
