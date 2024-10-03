const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

const assistantUrl = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/aff70292-eef5-46c2-a2cd-920abf9357de/v2/assistants/1f2cebd9-15bf-435d-8c12-c9bb2a559d2e/sessions';
const apiKey = process.env.APIKEY;

// Serve the frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Create session with Watson Assistant
async function createSession() {
  const response = await fetch(`${assistantUrl}?version=2021-06-14`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('apikey:' + apiKey),
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log("API Key: ", process.env.APIKEY);

  console.log(data.session_id);
  return data.session_id;
}

// Send message to Watson Assistant
// Function to send a message to Watson Assistant
async function sendMessage(sessionId, message) {
  const response = await fetch(`${assistantUrl}/${sessionId}/message?version=2021-06-14`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('apikey:' + apiKey),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: {
        message_type: 'text',
        text: message
      }
    })
  });

  const data = await response.json();

  // Check if 'generic' exists and contains at least one item
  if (data.output && data.output.generic && data.output.generic.length > 0) {
    return data.output.generic[0].text;
  } else {
    return "I'm sorry, I don't understand your request.";
  }
}


// API route to handle sending messages
app.post('/api/message', express.json(), async (req, res) => {
  const { message } = req.body;
  const sessionId = await createSession();
  const botResponse = await sendMessage(sessionId, message);
  res.json({ response: botResponse });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
