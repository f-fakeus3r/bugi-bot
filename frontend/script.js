// Function to send messages to the server
async function sendMessage(message) {
  const response = await fetch('/api/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  displayBotResponse(data.response);
}

// Function to display bot responses in the chat
function displayBotResponse(response) {
  const chatContainer = document.querySelector('.chat');

  response.forEach(item => {
    if (typeof item === 'string') {
      const processedMessage = item.replace(/\n/g, '<br>');
      const botMessage = document.createElement('div');
      botMessage.classList.add('chat-bot');
      botMessage.innerHTML = processedMessage;
      chatContainer.appendChild(botMessage);
    } else if (item.options) {
      const botMessage = document.createElement('div');
      botMessage.classList.add('chat-bot');

      const title = document.createElement('h3');
      title.textContent = item.title;
      botMessage.appendChild(title);

      if (item.description) {
        const description = document.createElement('p');
        description.textContent = item.description;
        botMessage.appendChild(description);
      }

      item.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.label;
        button.classList.add('option-button');
        button.onclick = () => sendMessage(option.value);
        botMessage.appendChild(button);
      });

      chatContainer.appendChild(botMessage);
    }
  });

  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Adiciona parágrafos vazios após a resposta do bot
  addEmptyParagraphs(chatContainer);
}

// Function to send and display user messages
function sendUserMessage() {
  const inputField = document.getElementById('input');
  const userMessage = inputField.value;

  if (userMessage.trim()) {
    const chatContainer = document.querySelector('.chat');

    // Remove parágrafos vazios antes de adicionar a mensagem do usuário
    removeEmptyParagraphs(chatContainer);

    const userDiv = document.createElement('div');
    userDiv.classList.add('meu');
    userDiv.textContent = userMessage;
    chatContainer.appendChild(userDiv);

    // Send message to server
    sendMessage(userMessage);

    // Clear input field
    inputField.value = '';

    // Auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Event listener for sending input messages via click
document.querySelector('.fa-arrow-up').addEventListener('click', () => {
  sendUserMessage();
});

// Event listener for sending input messages via pressing "Enter"
document.getElementById('input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendUserMessage();
  }
});

// Função para adicionar parágrafos vazios
function addEmptyParagraphs(chat) {
  const paragraph1 = document.createElement('p');
  const paragraph2 = document.createElement('p');
  chat.appendChild(paragraph1);
  chat.appendChild(paragraph2);
}

// Função para remover parágrafos vazios
function removeEmptyParagraphs(chat) {
  const emptyParagraphs = chat.querySelectorAll('p');
  emptyParagraphs.forEach(paragraph => paragraph.remove());
}
