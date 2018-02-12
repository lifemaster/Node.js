const http = require('http');
const fs = require('fs');

const chat = require('./chat');

http.createServer((req, res) => {
  switch(req.url) {
    case '/':
      sendFile('index.html', res);
      break;

    case '/subscribe':
      chat.subscribe(res);
      break;

    case '/publish':
      let body = '';

      req
        .on('readable', () => {
          const data = req.read();

          if (data) body += data;

          if (body.length > 1e4) {
            res.statusCode = 413;
            res.end('Your message is too big for my little chat');
          }
        })
        .on('end', () => {
          chat.publish(body);
          res.end('ok');
        });
      break;

    default:
      res.statusCode = 404;
      res.end('Not found');
  }
}).listen(1234, () => console.log('Server is listening on port 1234'));

function sendFile(fileName, res) {
  const fileStream = fs.createReadStream(fileName);

  fileStream
    .on('error', err => {
      if (err.code == 'ENOENT') {
        res.statusCode = 404;
        res.end('File does not exist');
      } else {
        res.statusCode = 500;
        res.end('Server error has occurred');
      }
    })
    .pipe(res);
}
