const EventEmitter = require('events').EventEmitter;

const server = new EventEmitter;

// Add event listeners
// Events are handled according to their order
server.on('request', request => {
  request.approved = true;
});

server.on('request', request => {
  console.log(request);
});

// Special error event should be handled
// Otherwise we will get an exception
server.on('error', err => {
  console.log('An error has occurred. Message: ', err.message);
})

// Invoke events
server.emit('request', { from: 'Client' });
server.emit('request', { form: 'One more client' });

// Invoke special error event
server.emit('error', new Error('Something went wrong'));
