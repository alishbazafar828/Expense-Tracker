const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// GET ALL
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const expense = await Expense.create({
      title, amount, category, userId: req.user.id,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, amount, category } = req.body;
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;