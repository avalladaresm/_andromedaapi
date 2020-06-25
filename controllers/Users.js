'use strict'

var UsersModel = require('../models/Users')
var dbConfig = require('../config/db')
var { Sequelize, DataTypes, QueryTypes } = require('sequelize')
var bcrypt = require('bcrypt')
var moment = require('moment')

/**
 *  https://stackoverflow.com/questions/47056395/how-to-pass-a-datetime-from-nodejs-sequelize-to-mssql
 *  https://github.com/sequelize/sequelize/issues/7879
 *  Sequelize issue were type: Sequelize.DATE is unable to store value on DB
 *  even though it is a valid datatype. In my case, Sequelize was throwing this error:
 *  SequelizeDatabaseError: Conversion failed when converting date and/or time from character string.
 *  when defining the Sessions model.
 */
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

module.exports.getUsers = function getUsers (req, res, next) {
  const users = []
  UsersModel(connection).findAll().then((data) => {
    data.map((u) => {
      users.push(u.dataValues)
    })
    res.send(users)
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.createUser = function createUser (req, res, next) {
  var params = req.openapi.swaggerParameters[0].query.data
  var now = moment()
  bcrypt.hash(params.password, 10).then((hash) => {
    UsersModel(connection).create({
      userName: params.userName,
      password: hash,
      firstName: params.firstName,
      middleName: params.middleName,
      lastName: params.lastName,
      gender: params.gender,
      dob: params.dob,
      email: params.email,
      address: params.address,
      cellphone: params.cellphone,
      verified: false,
      createdAt: moment(now, 'YYYY-MM-DD HH:mm').toISOString(),
      updatedAt: moment(now, 'YYYY-MM-DD HH:mm').toISOString(),
      cityId: params.cityId,
      stateId: params.stateId,
      countryId: params.countryId,
      roleId: 1
    }).then(() => {
      res.status(200).send('User created successfully.')
    }).catch((e) => {
      console.log('Error creating user:\n', e)
    })
  }).catch((e) => {
    console.log('Error hashing password:\n', e)
  })
}

module.exports.getUserById = function getUserById (req, res, next) {
  var userId = req.openapi.pathParams.id
  UsersModel(connection).findAll({
    where: {
      id: userId
    }
  }).then((data) => {
    if (data.length) res.send(data[0].dataValues)
    else res.status(404).send('User not found.')
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.updateUserById = function updateUserById (req, res, next) {
  var userId = req.openapi.pathParams.id
  var params = req.openapi.swaggerParameters[0].query
  var now = moment()
  UsersModel(connection).update({
    firstName: params.firstName,
    middleName: params.middleName,
    lastName: params.lastName,
    gender: params.gender,
    dob: params.dob,
    email: params.email,
    address: params.address,
    cellphone: params.cellphone,
    cityId: params.cityId,
    stateId: params.stateId,
    countryId: params.countryId,
    updatedAt: moment(now, 'YYYY-MM-DD HH:mm').toISOString()
  }, {
    where: {
      id: userId
    }
  }).then(() => {
    res.status(200).send('User updated successfully.')
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.deleteUserById = function deleteUserById (req, res, next) {
  var userId = req.openapi.pathParams.id
  UsersModel(connection).destroy({
    where: {
      id: userId
    }
  }).then(() => {
    res.status(200).send('User deleted successfully.')
  }).catch((e) => {
    console.log('Error:\n', e)
  })
}

module.exports.doesUserExists = function doesUserExists (req, res, next) {
  var userId = req.openapi.pathParams.id
  connection.query('doesUserExists :userId', {
    replacements: { userId: userId },
    type: QueryTypes.SELECT
  }).then((data) => {
    if (data[0].exists === 1) res.send({ exists: true })
    else res.send({ exists: false })
  }).catch((e) => {
    console.log('Error:\n', e)
    res.status(400).send()
  })
}

module.exports.getUsersCount = function getUsersCount (req, res, next) {
  var params = req.openapi.swaggerParameters[0].query
  UsersModel(connection).count({
    where: params
  }).then((data) => {
    res.send({ count: data })
  }).catch((e) => {
    console.log('Error:\n', e)
    res.status(400).send()
  })
}

module.exports.findUsers = function findUsers (req, res, next) {
  var params = req.openapi.swaggerParameters[0].query
  UsersModel(connection).findAll({
    where: params
  }).then((data) => {
    if (!data.length) {
      res.send({ message: 'No matching results.', results: 0 })
    }
    res.send(data)
  }).catch((e) => {
    console.log('Error:\n', e)
    res.status(400).send()
  })
}
