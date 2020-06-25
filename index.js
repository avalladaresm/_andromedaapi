'use strict'
require('dotenv').config()
var express = require('express')
var path = require('path')
var http = require('http')
var oas3Tools = require('oas3-tools')
const bodyParser = require('body-parser')
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

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort)
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort)
})
