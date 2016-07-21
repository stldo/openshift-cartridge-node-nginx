const http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello world!');
}).listen(process.env.NODE_SOCKET);
