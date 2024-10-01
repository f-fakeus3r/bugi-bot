const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const Groq = require('groq-sdk');

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create the Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON in request bodies
app.use(express.json());

// Endpoint to handle chat completions
app.post('/completion', async (req, res) => {
  // Extract role and content from the request body
  const { role, content } = req.body;

  // Ensure the required parameters are provided
  if (!role) {
    return res.status(400).json({ error: "Please provide 'role' request body" });
  } else if (!content) {
    return res.status(400).json({ error: "Please provide 'content' request body" });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(role, content);
    // Return the completion message as a JSON response
    res.json({
      message: chatCompletion.choices[0]?.message?.content || "No content",
    });
  } catch (error) {
    // Handle and return any errors
    res.status(500).json({ error: error.message });
  }
});

// Function to get the chat completion from Groq
async function getGroqChatCompletion(role, content) {
  return groq.chat.completions.create({
    messages: [{
      role: "system",
      content: "você é uma IA que será usada como resposta de fallback em um chatbot. O chatbot possui uma interface html e sera usada por leigos, portanto, suas respostas devem ser sucintas de no máximo 10 linhas. Completa, mas sem muitos detalhes e linguajar técnico. Sempre responder em portugues do brasil",
    },
    {
      role: role, // Use dynamic role
      content: content, // Use dynamic content
    }],
    model: "llama3-8b-8192",
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
