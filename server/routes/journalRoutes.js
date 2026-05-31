const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createJournal,
    getJournals,
    getJournalById,
    updateJournal,
    deleteJournal,
} = require("../controllers/journalController");

router.post("/", protect, createJournal);
router.get("/", protect, getJournals);
router.get("/:id", protect, getJournalById);
router.put("/:id", protect, updateJournal);
router.delete("/:id", protect, deleteJournal);

module.exports = router;