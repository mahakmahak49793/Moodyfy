const Gratitude = require("../models/Gratitude");

const createGratitude = async(req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required",
            });
        }

        const gratitude = await Gratitude.create({
            text,
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Gratitude added",
            gratitude,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getGratitudes = async(req, res) => {
    try {
        const gratitudes = await Gratitude.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gratitudes.length,
            gratitudes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteGratitude = async(req, res) => {
    try {
        const gratitude = await Gratitude.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!gratitude) {
            return res.status(404).json({
                success: false,
                message: "Gratitude not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Gratitude deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createGratitude,
    getGratitudes,
    deleteGratitude,
};