'use strict'

// var dbConfig = require('../config/db')
var { /* Sequelize, */ DataTypes } = require('sequelize')

DataTypes.DATE.prototype._stringify = function (date, options) {
  date = this._applyTimezone(date, options)
  return date.format('YYYY-MM-DD HH:mm:ss.SSS')
}.bind(DataTypes.DATE.prototype)

/* const connection = new Sequelize(
  dbConfig.options.database,
  dbConfig.authentication.options.userName,
  dbConfig.authentication.options.password,
  {
    host: dbConfig.server,
    dialect: 'mssql',
    logging: console.log
  }
) */

module.exports.getTableName = function getTableName (req, res) {}

module.exports.createTableName = function createTableName (req, res) {}

module.exports.getTableNameById = function getTableNameById (req, res) {}

module.exports.updateTableNameById = function updateTableNameById (req, res) {}

module.exports.deleteTableNameById = function deleteTableNameById (req, res) {}

module.exports.doesTableNameExists = function doesTableNameExists (req, res) {}

module.exports.getTableNameCount = function getTableNameCount (req, res) {}

module.exports.findTableName = function findTableName (req, res) {}
