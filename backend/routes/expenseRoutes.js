const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} = require('../controllers/expenseController');

router.get('/', authMiddleware, getExpenses);

router.post('/', authMiddleware, addExpense);

router.delete('/:id', authMiddleware, deleteExpense);
router.put('/:id', authMiddleware, updateExpense);
module.exports = router;