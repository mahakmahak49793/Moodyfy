const Groq = require("groq-sdk");
const Journal = require("../models/Journals");
const AIInsight = require("../models/AIInsight");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeJournal = async(req, res) => {
    try {
        const { journalId } = req.body;

        if (!journalId) {
            return res.status(400).json({
                success: false,
                message: "Journal ID is required",
            });
        }

        const journal = await Journal.findOne({
            _id: journalId,
            user: req.user.id,
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found",
            });
        }

        const prompt = `
Analyze the following journal entry and return ONLY valid JSON with no markdown or code fences.

Journal:
"${journal.content}"

Format:
{
  "emotion": "",
  "summary": "",
  "triggers": [],
  "positiveMoments": [],
  "suggestion": ""
}
`;

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const text = response.choices[0].message.content;
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        const insight = await AIInsight.create({
            journal: journal._id,
            emotion: parsed.emotion,
            summary: parsed.summary,
            triggers: parsed.triggers,
            positiveMoments: parsed.positiveMoments,
            suggestion: parsed.suggestion,
        });

        res.status(200).json({
            success: true,
            insight,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    analyzeJournal,
};