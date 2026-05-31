const Mood = require("../models/Mood");

const createMood = async(req, res) => {
    try {
        const { mood, score, note } = req.body;

        if (!mood || !score) {
            return res.status(400).json({
                success: false,
                message: "Mood and score are required",
            });
        }

        const moodLog = await Mood.create({
            mood,
            score,
            note,
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Mood logged successfully",
            moodLog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMoods = async(req, res) => {
    try {
        const moods = await Mood.find({
            user: req.user.id,
        }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: moods.length,
            moods,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createMood,
    getMoods,
};