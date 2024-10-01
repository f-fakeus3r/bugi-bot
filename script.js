document.querySelector('.fa-solid').addEventListener('click', () => {
  const input = document.getElementById('input').value.trim();

  if (input !== '') {
    const p = document.createElement('p');
    p.innerHTML = input
    p.classList.add('meu')

    const chat = document.querySelector('.chat');
    chat.appendChild(p);

    document.getElementById('input').value = ''
  }

})