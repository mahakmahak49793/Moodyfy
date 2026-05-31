const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createGratitude,
    getGratitudes,
    deleteGratitude,
} = require("../controllers/gratitudeController");

router.post("/", protect, createGratitude);
router.get("/", protect, getGratitudes);
router.delete("/:id", protect, deleteGratitude);

module.exports = router;