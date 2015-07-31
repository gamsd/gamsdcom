var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {

  if (req.url === '/gamsd.jpg') {

    var img = fx.readFileSync('./gamsd.jpg');
    res.writeHead(200, {"Content-Type": "image/jpeg"});
    res.end(img,'binary');
    return;

  } (req.url === '/favicon.ico') {

    var img = fs.readFileSync('./favicon.ico');
    res.writeHead(200, {"Content-Type": "image/x-icon"});
    res.end(img,'binary');
    return;

  } else if (req.url === '/screen.css') {

    var css = fs.readFileSync('./screen.css');
    res.writeHead(200, {"Content-Type": "text/css"});
    res.end(css,'binary');
    return;

  }

  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.end(index);
}).listen(8080);
