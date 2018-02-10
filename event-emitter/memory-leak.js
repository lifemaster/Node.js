const EventEmitter = require('events').EventEmitter;

const db = new EventEmitter();

function Request() {
  const self = this;

  this.bigData = new Array(1e6).join('*');

  this.send = function(data) {
    console.log(data);
  }

  function onData(info) {
    self.send(info);
  }

  this.end = function() {
    db.removeListener('data', onData);
  }

  // Add event listener
  db.on('data', onData);
}

setInterval(() => {
  // New request object is created every 200 ms
  // By this way listener count increases
  const request = new Request();

  /* ... some operations with request ... */

  // Call this method to remove event listener
  // It allows to avoid memory leak
  request.end(); // comment this row to look at memory leak

  const listenerCount = db.listenerCount('data');
  const usedMemory = process.memoryUsage().heapUsed;

  console.log(`Used memory: ${usedMemory} bytes`);
  console.log(`Event listener count for event "data" = ${listenerCount}`);
}, 200);
