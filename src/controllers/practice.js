const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let text = ``;

const practice = async (req, res) => {
  try {
    let prompt = req.body.prompt || 'Write a story about a magic backpack.';

    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.json({
      response: text,
      message: 'successfully fetched response from AI.',
    });
  } catch (err) {
    console.error(err);
    res.json({ message: "couldn't fetch response from AI" });
  }
};

module.exports = {
  practice,
};
