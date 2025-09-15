// course-marketplace-backend/controllers/aiController.js
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * @desc    Summarize lesson content using Groq AI
 * @route   POST /api/ai/summarize
 * @access  Private
 */
exports.summarizeContent = async (req, res) => {
    const { content } = req.body;

    // Basic validation to ensure we have meaningful content before calling the API.
    if (!content || typeof content !== 'string' || content.trim().length < 50) {
        return res.status(400).json({ message: "Sufficient content is required for a summary." });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    // The system prompt sets the persona and instructions for the AI model.
                    role: "system",
                    content: "You are an expert educator. Your task is to summarize the provided lesson content into 3-5 concise, key bullet points. Focus on the most critical takeaways a student should remember. Use markdown for the bullet points."
                },
                {
                    role: "user",
                    content: `Please summarize the following lesson content:\n\n---\n${content}\n---`,
                },
            ],
            model: "llama-3.3-70b-versatile", // A fast and capable model for this task
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
        });

        // Safely access the generated summary and provide a fallback message.
        const summary = chatCompletion.choices[0]?.message?.content || "Could not generate a summary.";
        res.json({ summary });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ message: "Failed to generate AI summary." });
    }
};