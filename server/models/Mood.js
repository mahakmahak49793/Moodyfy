const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    mood: {
        type: String,
        enum: ["happy", "calm", "neutral", "stressed", "sad"],
        required: true,
    },

    score: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },

    note: {
        type: String,
        default: "",
    },

    date: {
        type: Date,
        default: Date.now,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Mood", moodSchema);