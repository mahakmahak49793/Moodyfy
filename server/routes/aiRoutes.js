const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { analyzeJournal } = require("../controllers/aiController");

router.post("/analyze", protect, analyzeJournal);

module.exports = router;