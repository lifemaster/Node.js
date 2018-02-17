const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

const log = require('./libs/log')(module);

const app = express();

// usage connect logger
app.use(require('connect-logger')({ immediate: true }));

// usage static routes from given folder
app.use(express.static(path.join(__dirname, 'public')));

// connect body parser to parse POST body as json
app.use(bodyParser.json());

// route handlers
require('./routes')(app);

// create server and pass processing to express
const server = http.createServer(app);

// run server
server.listen(1234, () => log.info('Server is listening on port 1234'));
