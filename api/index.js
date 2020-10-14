/*
 *
 * Primary file for the API
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const { StringDecoder } = require("string_decoder");
const url = require("url");
const stringDecocer = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instantiate the HTTP server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

// Start server on a port from config
httpServer.listen(config.httpPort, function () {
  console.log(
    `Server: listen, port: ${config.httpPort}, mode: ${config.envName}`
  );
});

// Instantiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(res, req);
});
// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log(
    `Server: listen, port: ${config.httpsPort}, mode: ${config.envName}`
  );
});

// All the server logic for both http and https serve
var unifiedServer = function (req, res) {
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
    4;
    buffer += decoder.end();

    // Choose handler to route request, if none send to not found
    var choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // construct data object to send to handler

    var data = {
      trimmerPath: trimmedPath,
      querStringObject: queryStringObect,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to specified handler in router

    choosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object

      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log request path
      console.log(`Server: request, path: ${trimmedPath}, method: ${method}`);
      console.log(`Server: query-string-parameters: `, queryStringObect);
      console.log(`Server: request-headers: `, headers);
      console.log(`Server: request-payload:`, buffer);
      console.log(
        `Server: response: status code: ${statusCode}, payload string: ${payloadString}`
      );
    });
  });
};

// Define handlers

var handlers = {};

// Ping handlers
handlers.ping = function(data, callback){
  callback(200);
}

// Not found handler

handlers.notFound = function (data, callback) {
  callback(404);
};

// Define request router
var router = {
  ping: handlers.ping,
};
