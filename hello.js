//load http module
const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

//create http server
const server = http.createServer(function (req, res) {
  //set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" });

  //send the response body "Hello world"
  res.end("Hello World\n");
});

server.listen(port, hostname, function () {
  console.log(`Server running at http:${hostname}:${port}/`);
});
