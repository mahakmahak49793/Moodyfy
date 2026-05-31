const mongoose = require("mongoose");

const aiInsightSchema = new mongoose.Schema({
    journal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal",
        required: true,
    },

    emotion: String,
    summary: String,
    triggers: [String],
    positiveMoments: [String],
    suggestion: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model("AIInsight", aiInsightSchema);