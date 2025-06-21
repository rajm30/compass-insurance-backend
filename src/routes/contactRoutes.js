const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const {
  validateContact,
  validateContactUpdate,
} = require("../validation/validation");

router.post("/", validateContact, createContact);
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.put("/:id", validateContactUpdate, updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
