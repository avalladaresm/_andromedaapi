'use strict'

var CountriesModel = require('../models/Countries')
var dbConfig = require('../config/db')
var { Sequelize, DataTypes, QueryTypes } = require('sequelize')
var _ = require('lodash')
var utils = require('../utils/utils')

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
  var countryId = req.openapi.pathParams.countryId
  connection.query('getAllCitiesByStateIdByCountryId :countryId', {
    replacements: { countryId: countryId },
    type: QueryTypes.SELECT
  }).then((data) => {
    var transformed = utils.transformCountryData(data)
    res.send(transformed)
  }).catch((e) => {
    res.status(400).send({customErrorMessage: e.message})
  })
}

module.exports.getCitiesByStateIdByCountryId = function getCitiesByStateIdByCountryId (req, res) {
  var countryId = req.openapi.pathParams.countryId
  var stateId = req.openapi.pathParams.stateId
  connection.query('getCitiesByStateIdByCountryId :stateId, :countryId', {
    replacements: { stateId: stateId, countryId: countryId },
    type: QueryTypes.SELECT
  }).then((data) => {
    var transformed = utils.transformCountryData(data)
    res.send(transformed)
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
    else res.status(404).send({customMessage:'Country not found.'})
  }).catch((e) => {
    res.status(400).send({customErrorMessage: e.message})
  })
}

module.exports.updateTableNameById = function updateTableNameById (req, res) {}

module.exports.deleteTableNameById = function deleteTableNameById (req, res) {}

module.exports.doesCountryExists = function doesCountryExists (req, res) {
  var countryId = req.openapi.pathParams.id
  connection.query('doesCountryExists :countryId', {
    replacements: { countryId: countryId },
    type: QueryTypes.SELECT
  }).then((data) => {
    if (data[0].exists === 1) res.send({ exists: true })
    else res.send({ exists: false })
  }).catch((e) => {
    console.log('Error:\n', e)
    res.status(400).send(e)
  })
}

module.exports.getTableNameCount = function getTableNameCount (req, res) {}

module.exports.findTableName = function findTableName (req, res) {}
