const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    content: {
        type: String,
        required: true,
    },

    tags: [{
        type: String,
    }, ],

    mood: {
        type: String,
        enum: ["happy", "calm", "neutral", "stressed", "sad"],
        required: true,
    },

    voiceNote: {
        type: String,
        default: "",
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Journal", journalSchema);