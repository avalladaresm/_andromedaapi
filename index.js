'use strict'
require('dotenv').config()
var express = require('express')
var path = require('path')
var http = require('http')
var oas3Tools = require('oas3-tools')
const bodyParser = require('body-parser')
var cors = require('cors')
var serverPort = 8080

// swaggerRouter configuration
var options = {
  controllers: path.join(__dirname, './controllers')
}

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/api.yaml'), options)
expressAppConfig.addValidator()
var app = expressAppConfig.getApp()

app.set('view-engine', 'pug')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000', 'http://192.168.1.100:8000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Server,Date,Access-Control-Allow-Credentials,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Accept,Origin,X-Requested-With');
  // Pass to next layer of middleware
  next();
});
app.options('*', cors());

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort)
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort)
})
