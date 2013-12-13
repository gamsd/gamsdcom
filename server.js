
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {

  if (req.url === '/favicon.ico') {
    var img = fs.readFileSync('./favicon.ico');
    res.writeHead(200, {"Content-Type": "image/x-icon"});
    res.end(img,'binary');
    return;
  }

  if (req.url === '/bootstrap.min.css') {
    var css = fs.readFileSync('./bootstrap.min.css');
    res.writeHead(200, {"Content-Type": "text/css"});
    res.end(css, "utf-8");
    return;
  }

  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.end(index);
}).listen(8080);
