const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

const assistantUrl = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/aff70292-eef5-46c2-a2cd-920abf9357de/v2/assistants/1f2cebd9-15bf-435d-8c12-c9bb2a559d2e/sessions';
const apiKey = process.env.APIKEY;

// Global variable to store the session ID
let sessionId = null;

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
  console.log("New session ID:", data.session_id);
  return data.session_id;
}

// Send message to Watson Assistant
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
  const output = data.output.generic;

  // Initialize an empty response array
  let formattedResponse = [];

  // Loop through each response in the 'generic' array
  output.forEach(item => {
    if (item.response_type === 'text') {
      // Handle text response
      formattedResponse.push(item.text);
    } else if (item.response_type === 'option') {
      // Handle options (menus)
      const options = item.options.map(option => ({
        label: option.label,
        value: option.value.input.text
      }));
      formattedResponse.push({
        title: item.title,
        description: item.description,
        options: options
      });
    }
    // Add other response types as needed
    else {
      formattedResponse.push("Unsupported response type");
    }
  });

  return formattedResponse;
}

// API route to handle sending messages
app.post('/api/message', express.json(), async (req, res) => {
  const { message } = req.body;

  // Check if a session ID exists, otherwise create a new session
  if (!sessionId) {
    sessionId = await createSession();
  }

  const botResponse = await sendMessage(sessionId, message);
  res.json({ response: botResponse });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
