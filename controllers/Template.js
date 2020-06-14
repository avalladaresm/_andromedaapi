'use strict';

var utils = require('../utils/writer.js');
var Template = require('../service/TemplateService');
var dbConfig = require('../dbConfig');
var sql = require('mssql');

module.exports.getTableName = function getTableName(req, res, next) {
	Template.getTableName()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.createTableName = function createTableName(req, res, next) {
	Template.createTableName()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.getTableNameById = function getTableNameById(req, res, next) {
	Template.getTableNameById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.updateTableNameById = function updateTableNameById(req, res, next) {
	Template.updateTableNameById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.deleteTableNameById = function deleteTableNameById(req, res, next) {
	Template.deleteTableNameById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.doesTableNameExists = function doesTableNameExists(req, res, next) {
	Template.doesTableNameExists(userId)
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection:\n', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.getTableNameCount = function getTableNameCount(req, res, next) {
	Template.getTableNameCount()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.findTableName = function findTableName(req, res, next) {
	Template.findTableName()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn.connect().then(() => {}).catch((err) => {
				console.log('Error on connection', err);
			});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};
