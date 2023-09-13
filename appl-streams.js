import http from 'node:http';
import config from 'config'
import {URL } from 'node:url';
import RouterDocText from './routes/Router.js';

const SERVER_PORT = 'server.port'
const server = http.createServer();

const port = process.env.PORT || config.has(SERVER_PORT) && config.get(SERVER_PORT) || 0;

server.listen(port, () => console.log(`server is listening on port ${server.address().port}`));
new RouterDocText(server);
server.on('request', (req,response) => {
    const request = new URL (`http://${req.headers.host}${req.url}`);
    const file = request.searchParams.get('file');
    console.log(`request type: ${request.pathname}; file name is ${file}`);
    server.emit(request.pathname, file, response);
})


