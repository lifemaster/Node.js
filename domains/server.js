const fs = require('fs');
const domain = require('domain');

// Create server domain
const serverDomain = domain.create();

// Run server inside server domain
serverDomain.run(() => {
  // Pay attention - "require module" should be inside domain
  const http = require('http');

  const server = new http.createServer((req, res) => {

    // Create request/response domain
    const reqDomain = domain.create();

    reqDomain.add(req);
    reqDomain.add(res);

    // Run request handler inside request domain
    reqDomain.run(() => serverHandler(req, res));

    // Request domain error handler
    reqDomain.on('error', err => {
      res.statusCode = 500;
      res.end('Internal server error');

      console.log('Request domain error: ', err);

      // Fire server domain error event as well
      serverDomain.emit('error', err);
    });
  });

  server.listen(1234, () => console.log('Server is listening on port 1234'));
});

// Server domain error handler
serverDomain.on('error', err => {
  console.log('Server domain error: ', err);
});

// Request handler
function serverHandler(req, res) {
  if (req.url == '/') {
    fs.readFile('index.htmll', (err, content) => {
      if (err) {
        throw err; // source of an exception
      } else {
        res.end(content);
      }
    });
  }
}
