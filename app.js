var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'revealjs')));
app.use('/talks', express.static(path.join(__dirname, 'revealjs', 'talks')));

app.use(function(req, res, next) {
  res.redirect('/')
});

module.exports = app;
