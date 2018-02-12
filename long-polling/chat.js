let clients = [];

exports.subscribe = function(res) {
  console.log('Subscribe');

  clients.push(res);

  res.on('close', () => clients.splice(clients.indexOf(res), 1));
};

exports.publish = function(message) {
  console.log("publish '%s'", message);

  clients.forEach(res => res.end(message));
  clients = [];
}

setInterval(() => {
  console.log('Client count:', clients.length);
}, 2000);
