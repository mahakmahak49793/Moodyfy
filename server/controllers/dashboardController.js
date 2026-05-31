const Mood = require("../models/Mood");
const Journal = require("../models/Journals");
const Gratitude = require("../models/Gratitude");

const getDashboardData = async(req, res) => {
    try {
        // moods
        const moods = await Mood.find({
            user: req.user.id,
        });

        // journals count
        const journalCount = await Journal.countDocuments({
            user: req.user.id,
        });

        // gratitude count
        const gratitudeCount = await Gratitude.countDocuments({
            user: req.user.id,
        });

        // mood distribution
        const moodDistribution = {
            happy: 0,
            calm: 0,
            neutral: 0,
            stressed: 0,
            sad: 0,
        };

        let totalScore = 0;

        moods.forEach((item) => {
            moodDistribution[item.mood]++;
            totalScore += item.score;
        });

        const averageMoodScore =
            moods.length > 0 ?
            (totalScore / moods.length).toFixed(1) :
            0;

        // recent moods
        const recentMoods = await Mood.find({
                user: req.user.id,
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,

            stats: {
                totalJournals: journalCount,
                totalGratitudes: gratitudeCount,
                totalMoodLogs: moods.length,
                averageMoodScore,
            },

            moodDistribution,

            recentMoods,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboardData,
};