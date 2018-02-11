const http = require('http');
const fs = require('fs');

new http.Server((req, res) => {
  if (req.url == '/big-data.html') {
    const file = fs.ReadStream('big-data.html');
    sendFile(file, res);
  }
}).listen(1234, () => console.log('Server is listening on port 1234'));

function sendFile(file, res) {
  // Special readable stream events only for fs.ReadStream (open/close file)
  file.on('open', () => console.log('File has been opened'));
  file.on('close', () => console.log('File has been closed'));

  // Handle "readable" event to get data (use method "pipe" to simplify)
  // file.on('readable', write);

  /**
   * We can use method "pipe" instead of handle "readable" event
   * to redirect data from readable to writable stream.
   * It allows to simplify code
   */
  file.pipe(res);

  // Event "end" is invoked when data source is finished
  file.on('end', () => res.end());

  // Special event "error" should be handled to avoid exception
  file.on('error', err => {
    if (err.code == 'ENOENT') {
      res.statusCode = 404;
      res.end('File does not exist');
    } else {
      res.statusCode = 500;
      res.end('Server error');
    }
    console.log(err);
  });

  // When connection is lost we should destroy readable stream to save memory
  res.on('close', () => file.destroy());

  // Event "finish" fires when data have been successfully sent
  res.on('finish', () => console.log('Data have been successfully sent'));

  // Handler for "readable" event
  function write() {
    // Read data from stream buffer
    const fileContent = file.read();

    // When connection is slow we should temporary wait while data will be written to "res" stream
    if (fileContent && !res.write(fileContent)) {
      file.removeListener('readable', write);

      res.once('drain', () => {
        file.on('readable', write);
        write();
      });
    }
  }
}
