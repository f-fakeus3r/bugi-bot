document.getElementById('input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const message = this.value;
    this.value = '';

    // Display user's message
    appendMessage('meu', message);

    // Send message to chatbot API
    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        const botMessage = data.response;
        appendMessage('chat-bot', botMessage);
      });
  }
});

function appendMessage(className, text) {
  const chatContainer = document.querySelector('.chat');
  const messageElement = document.createElement('p');
  messageElement.classList.add(className);
  messageElement.textContent = text;
  chatContainer.appendChild(messageElement);
}
