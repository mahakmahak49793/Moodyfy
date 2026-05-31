const Journal = require("../models/Journals");

const createJournal = async(req, res) => {
    try {
        const { title, content, tags, mood, voiceNote } = req.body;

        if (!title || !content || !mood) {
            return res.status(400).json({
                success: false,
                message: "Title, content and mood are required",
            });
        }

        const journal = await Journal.create({
            title,
            content,
            tags,
            mood,
            voiceNote,
            user: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Journal created successfully",
            journal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getJournals = async(req, res) => {
    try {
        const journals = await Journal.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: journals.length,
            journals,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getJournalById = async(req, res) => {
    try {
        const journal = await Journal.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found",
            });
        }

        res.status(200).json({
            success: true,
            journal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateJournal = async(req, res) => {
    try {
        const journal = await Journal.findOneAndUpdate({
                _id: req.params.id,
                user: req.user.id,
            },
            req.body, {
                new: true,
            }
        );

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Journal updated",
            journal,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteJournal = async(req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Journal deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createJournal,
    getJournals,
    getJournalById,
    updateJournal,
    deleteJournal,
};