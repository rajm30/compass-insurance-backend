const express = require("express");
const router = express.Router();
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} = require("../controllers/quoteController");

const {
  validateQuote,
  validateQuoteUpdate,
} = require("../validation/validation");

router.post("/", validateQuote, createQuote);
router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.put("/:id", validateQuoteUpdate, updateQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
