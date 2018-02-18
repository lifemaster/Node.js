const status = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const socket = io.connect(); // or set argument 'http://localhost:1234'

form.addEventListener('submit', e => {
  e.preventDefault();

  socket.emit('chat', input.value);
  input.value = '';
});

socket.on('connect', () => setStatus('ONLINE'));
socket.on('disconnect', () => setStatus('OFFLINE'));
socket.on('chat', message => printMessage(message));
socket.on('ready', message => printMessage(message));

function setStatus(value) {
  status.innerHTML = value;
}

function printMessage(value) {
  const li = document.createElement('li');

  li.innerHTML = value;
  messages.appendChild(li);
}
