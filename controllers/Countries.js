'use strict'

var CountriesModel = require('../models/Countries')
var StatesModel = require('../models/States')
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

module.exports.getCountries = function getCountries (req, res) {
  const countries = []
  CountriesModel(connection).findAll().then((data) => {
    data.map((u) => {
      countries.push(u.dataValues)
    })
    res.send(countries)
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.getStatesByCountryId = function getStatesByCountryId (req, res) {
  const states = []
  var countryId = req.openapi.pathParams.countryId
  StatesModel(connection).findAll({
    where: {
      countryId: countryId
    }
  }).then((data) => {
    if (!data.length) res.status(404).send('Country not found.')
    data.map((u) => {
      states.push(u.dataValues)
    })
    res.send(states)
  }).catch((e) => {
    res.status(400).send({customErrorMessage: e.message})
  })
}

module.exports.createTableName = function createTableName (req, res) {}

module.exports.getCountryById = function getCountryById (req, res) {
  var countryId = req.openapi.pathParams.id
  CountriesModel(connection).findAll({
    where: {
      id: countryId
    }
  }).then((data) => {
    if (data.length) res.send(data[0].dataValues)
    else res.status(404).send('Country not found.')
  }).catch((e) => {
    res.status(400).send({customErrorMessage: e.message})
  })
}

module.exports.updateTableNameById = function updateTableNameById (req, res) {}

module.exports.deleteTableNameById = function deleteTableNameById (req, res) {}

module.exports.doesTableNameExists = function doesTableNameExists (req, res) {}

module.exports.getTableNameCount = function getTableNameCount (req, res) {}

module.exports.findTableName = function findTableName (req, res) {}
