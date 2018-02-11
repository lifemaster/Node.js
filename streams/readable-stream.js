const fs = require('fs');

const filePath = './big-data.html';

// Create readable stream from file
const stream = new fs.ReadStream(filePath);

// Special readable stream events only for fs.ReadStream (open/close file)
stream.on('open', () => console.log('File has been opened'));
stream.on('close', () => console.log('File has been closed'));

// Event "readable" is invoked every time when buffer is full (64 kb)
// stream.read() allows to get data from buffer, clearing one
stream.on('readable', () => {
  const data = stream.read();
  console.log(data);
});

// Event "end" is invoked when data source is finished
stream.on('end', () => console.log('End file'));

// Special event "error" should be handled to avoid exception
stream.on('error', err => {
  if (err.code == 'ENOENT') {
    console.log(`File "${filePath}" does not exist`);
  } else {
    console.log('An error has occurred:', err);
  }
});
