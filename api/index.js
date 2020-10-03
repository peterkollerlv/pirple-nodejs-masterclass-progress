/*
 *
 * Primary file for the API
 *
 */

// Dependencies
const http = require("http");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;

// Server response to all requests via string
const server = http.createServer(function (req, res) {
  // Accept annd parse url
  const parsedUrl = url.parse(req.url, true);

  // Extract path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Extract query string as object
  const queryStringObect = parsedUrl.query;

  // Extract http method
  const method = req.method.toLowerCase();

  // Exract headers as object
  const headers = req.headers;

  // Extract payload if any
  const decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // Send response
    res.end("Hello world\n");

    // Log request path
    console.log(`Server: request, path: ${trimmedPath}, method: ${method}`);
    console.log(`Server: query-string-parameters: `, queryStringObect);
    console.log(`Server: request-headers: `, headers);
    console.log(`Server: request-payload:`, buffer);
  });
});

// Start server on port 3000
server.listen(3000, function () {
  console.log("Server: port, 3000, listen");
});
