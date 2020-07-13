'use strict'

var CitiesModel = require('../models/Cities')
var dbConfig = require('../config/db')
var { Sequelize, DataTypes, QueryTypes } = require('sequelize')

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

module.exports.getCities = function getCities (req, res) {
  const cities = []
  CitiesModel(connection).findAll().then((data) => {
    data.map((u) => {
      cities.push(u.dataValues)
    })
    res.send(cities)
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.createTableName = function createTableName (req, res) {}

module.exports.getCityById = function getCityById (req, res) {
  var cityId = req.openapi.pathParams.id
  CitiesModel(connection).findAll({
    where: {
      id: cityId
    },
    attributes: ['id', 'name']
  }).then((data) => {
    if (data.length) res.send(data[0].dataValues)
    else res.status(404).send('City not found.')
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.updateTableNameById = function updateTableNameById (req, res) {}

module.exports.deleteTableNameById = function deleteTableNameById (req, res) {}

module.exports.doesCityExists = function doesCityExists (req, res) {
  var cityId = req.openapi.pathParams.id
  connection.query('doesCityExists :cityId', {
    replacements: { cityId: cityId },
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
