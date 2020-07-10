'use strict'

var StatesModel = require('../models/States')
var CitiesModel = require('../models/Cities')
var dbConfig = require('../config/db')
var { Sequelize, DataTypes } = require('sequelize')

DataTypes.DATE.prototype._stringify = function (date, options) {
  date = this._applyTimezone(date, options)
  return date.format('YYYY-MM-DD HH:mm:ss.SSS')
}.bind(DataTypes.DATE.prototype)

const connection = new Sequelize(
  dbConfig.options.database,
  dbConfig.authentication.options.userName,
  dbConfig.authentication.options.password,
  {
    host: dbConfig.server,
    dialect: 'mssql',
    logging: console.log
  }
)

module.exports.getStates = function getStates (req, res) {
  const states = []
  StatesModel(connection).findAll().then((data) => {
    data.map((u) => {
      states.push(u.dataValues)
    })
    res.send(states)
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.getCitiesByStateId = function getCitiesByStateId (req, res) {
  const cities = []
  var stateId = req.openapi.pathParams.stateId
  CitiesModel(connection).findAll({
    where: {
      stateId: stateId
    }
  }).then((data) => {
    if (!data.length) res.status(404).send('Country not found.')
    data.map((u) => {
      cities.push(u.dataValues)
    })
    res.send(cities)
  }).catch((e) => {
    res.status(400).send({customErrorMessage: e.message})
  })
}

module.exports.createTableName = function createTableName (req, res) {}

module.exports.getStateById = function getStateById (req, res) {
  const cities = []
  var stateId = req.openapi.pathParams.stateId
  StatesModel(connection).findAll({
    where: {
      id: stateId
    }
  }).then((data) => {
    if (!data.length) res.status(404).send('State not found.')
    data.map((u) => {
      cities.push(u.dataValues)
    })
    res.send(cities)
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.updateTableNameById = function updateTableNameById (req, res) {}

module.exports.deleteTableNameById = function deleteTableNameById (req, res) {}

module.exports.doesTableNameExists = function doesTableNameExists (req, res) {}

module.exports.getTableNameCount = function getTableNameCount (req, res) {}

module.exports.findTableName = function findTableName (req, res) {}
