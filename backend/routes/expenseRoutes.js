const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// Create an expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = new Expense({ amount, category, description, date });
    await expense.save();
    res.status(201).json({ message: 'Expense created successfully!', expense });
  } catch (error) {
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
});

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, { amount, category, description, date }, { new: true });
    res.status(200).json({ message: 'Expense updated successfully!', updatedExpense });
  } catch (error) {
    res.status(400).json({ message: 'Error updating expense', error: error.message });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting expense', error: error.message });
  }
});

module.exports = router;
