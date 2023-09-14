const socket = io();

const chat = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const userList = document.getElementById('userList'); // Add an element to display the user list

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    appendMessage('You', message);
    socket.emit('message', message);
    messageInput.value = '';
  }
});

socket.on('message', ({ sender, message }) => {
  appendMessage(sender, message);
});

socket.on('userList', (users) => {
  updateUserList(users);
});

function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
}

function updateUserList(users) {
  userList.innerHTML = '';
  users.forEach((userId) => {
    const userElement = document.createElement('div');
    const userStatus = connectedUsers.get(userId).online ? 'online' : 'offline';
    userElement.textContent = `User ${userId} (${userStatus})`;
    userList.appendChild(userElement);
  });
}
