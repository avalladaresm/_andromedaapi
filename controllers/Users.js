'use strict';

var utils = require('../utils/writer.js');
var Users = require('../service/UsersService');
var dbConfig = require('../dbConfig');
var sql = require('mssql');
var lodash = require('lodash');

module.exports.getUsers = function getUsers(req, res, next) {
	Users.getUsers()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = 'select * from [andromedadb].dbo.users';
					request
						.query(query)
						.then((resp) => {
							res.send(resp.recordset);
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.createUser = function createUser(req, res, next) {
	var params = req.openapi.swaggerParameters[0].query.data;
	var firstName = params.firstName ? "'" + params.firstName + "'" : null,
		middleName = params.middleName ? "'" + params.middleName + "'" : null,
		lastName = params.lastName ? "'" + params.lastName + "'" : null,
		gender = params.gender ? "'" + params.gender + "'" : null,
		dob = params.dob ? "'" + params.dob + "'" : null,
		email = params.email ? "'" + params.email + "'" : null,
		address = params.address ? "'" + params.address + "'" : null,
		cellphone = params.cellphone ? "'" + params.cellphone + "'" : null,
		createdAt = "'" + new Date().toISOString() + "'",
		modifiedAt = createdAt,
		cityId = params.cityId ? params.cityId : null,
		stateId = params.stateId ? params.stateId : null,
		countryId = params.countryId ? "'" + params.countryId + "'" : null,
		roleId = params.roleId ? params.roleId : null;
	Users.createUser()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `insert into [andromedadb].dbo.Users (
						firstName, middleName, lastName, dob, 
						email, gender, verified, address, 
						cellphone, createdAt, modifiedAt, cityId, 
						stateId, countryId, roleId) 
						values (
							${firstName}, ${middleName}, ${lastName}, 
							${dob}, ${email}, ${gender}, 0, 
							${address}, ${cellphone}, ${createdAt}, ${modifiedAt},
							${cityId}, ${stateId}, ${countryId}, ${roleId}
						)`;
					request
						.query(query)
						.then(() => {
							res.status(200).send('User created successfully.');
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.getUserById = function getUserById(req, res, next) {
	var userId = req.openapi.pathParams.id;
	Users.getUserById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `select * from [andromedadb].dbo.users where id=${userId}`;
					request
						.query(query)
						.then((resp) => {
							res.send(resp.recordset[0]);
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.updateUserById = function updateUserById(req, res, next) {
	var userId = req.openapi.pathParams.id;
	var params = req.openapi.swaggerParameters[0].query;
	var firstName = params.firstName ? params.firstName : null,
		middleName = params.middleName ? params.middleName : null,
		lastName = params.lastName ? params.lastName : null,
		gender = params.gender ? params.gender : null,
		dob = params.dob ? params.dob : null,
		email = params.email ? params.email : null,
		address = params.address ? params.address : null,
		cellphone = params.cellphone ? params.cellphone : null,
		cityId = params.cityId ? params.cityId : null,
		stateId = params.stateId ? params.stateId : null,
		countryId = params.countryId ? params.countryId : null,
		modifiedAt = new Date().toISOString();
	var toUpdate = {};
	firstName ? (toUpdate['firstName'] = "'" + firstName + "'") : firstName;
	middleName ? (toUpdate['middleName'] = "'" + middleName + "'") : middleName;
	lastName ? (toUpdate['lastName'] = "'" + lastName + "'") : lastName;
	gender ? (toUpdate['gender'] = "'" + gender + "'") : gender;
	dob ? (toUpdate['dob'] = "'" + dob + "'") : dob;
	email ? (toUpdate['email'] = "'" + email + "'") : email;
	address ? (toUpdate['address'] = "'" + address + "'") : address;
	cellphone ? (toUpdate['cellphone'] = "'" + cellphone + "'") : cellphone;
	modifiedAt ? (toUpdate['modifiedAt'] = "'" + modifiedAt + "'") : modifiedAt;
	cityId ? (toUpdate['cityId'] = cityId) : cityId;
	stateId ? (toUpdate['stateId'] = stateId) : stateId;
	countryId ? (toUpdate['countryId'] = "'" + countryId + "'") : countryId;
	var k = lodash.keys(toUpdate);
	var v = lodash.values(toUpdate);
	var q = '';
	for (let i = 0; i < k.length; i++) {
		if (i === k.length - 1) q = q.concat(`${k[i]} = ${v[i]}`);
		else q = q.concat(`${k[i]} = ${v[i]}, `);
	}
	Users.updateUserById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `update [andromedadb].dbo.Users 
								set ${q} where id = ${userId}`;
					request
						.query(query)
						.then(() => {
							res.status(200).send('User updated successfully.');
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.deleteUserById = function deleteUserById(req, res, next) {
	var userId = req.openapi.pathParams.id;
	Users.deleteUserById()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `delete from [andromedadb].dbo.Users where id=${userId}`;
					request
						.query(query)
						.then(() => {
							res.status(200).send('User deleted successfully.');
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.doesUserExists = function doesUserExists(req, res, next) {
	var userId = req.openapi.pathParams.id;
	Users.doesUserExists(userId)
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var sproc = '[andromedadb].dbo.doesUserExists';
					request.input('userId', sql.Int, userId);
					request.execute(sproc, (err, result) => {
						if (err) {
							next(err);
						} else {
							if (result.recordset[0].exists == 1) res.send({ exists: true });
							else res.send({ exists: false });
						}
						dbConn.close();
					});
				})
				.catch((err) => {
					console.log('Error on connection:\n', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

//Issue: https://tecal.atlassian.net/browse/TEP-22 related
module.exports.getUsersCount = function getUsersCount(req, res, next) {
	var params = req.openapi.swaggerParameters[0].query;
	var firstName = params.firstName ? params.firstName : null,
		middleName = params.middleName ? params.middleName : null,
		lastName = params.lastName ? params.lastName : null,
		gender = params.gender ? params.gender : null,
		dob = params.dob ? params.dob : null,
		email = params.email ? params.email : null,
		address = params.address ? params.address : null,
		cellphone = params.cellphone ? params.cellphone : null,
		cityId = params.cityId ? params.cityId : null,
		stateId = params.stateId ? params.stateId : null,
		countryId = params.countryId ? params.countryId : null;
	var toCount = {};
	firstName ? (toCount['firstName'] = "'" + firstName + "'") : firstName;
	middleName ? (toCount['middleName'] = "'" + middleName + "'") : middleName;
	lastName ? (toCount['lastName'] = "'" + lastName + "'") : lastName;
	gender ? (toCount['gender'] = "'" + gender + "'") : gender;
	dob ? (toCount['dob'] = "'" + dob + "'") : dob;
	email ? (toCount['email'] = "'" + email + "'") : email;
	address ? (toCount['address'] = "'" + address + "'") : address;
	cellphone ? (toCount['cellphone'] = "'" + cellphone + "'") : cellphone;
	cityId ? (toCount['cityId'] = cityId) : cityId;
	stateId ? (toCount['stateId'] = stateId) : stateId;
	countryId ? (toCount['countryId'] = "'" + countryId + "'") : countryId;
	var k = lodash.keys(toCount);
	var v = lodash.values(toCount);
	var q = '';
	for (let i = 0; i < k.length; i++) {
		if (i === k.length - 1) q = q.concat(`u.${k[i]} = ${v[i]}`);
		else q = q.concat(`u.${k[i]} = ${v[i]} and `);
	}
	Users.getUsersCount()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `select count(id) as count from 
								[andromedadb].dbo.Users as u where ${q}`;
					request
						.query(query)
						.then((result) => {
							res.send(result.recordset[0]);
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};

module.exports.findUsers = function findUsers(req, res, next) {
	var params = req.openapi.swaggerParameters[0].query;
	var id = params.id ? params.id : null,
		firstName = params.firstName ? params.firstName : null,
		middleName = params.middleName ? params.middleName : null,
		lastName = params.lastName ? params.lastName : null,
		gender = params.gender ? params.gender : null,
		dob = params.dob ? params.dob : null,
		email = params.email ? params.email : null,
		address = params.address ? params.address : null,
		cellphone = params.cellphone ? params.cellphone : null,
		cityId = params.cityId ? params.cityId : null,
		stateId = params.stateId ? params.stateId : null,
		countryId = params.countryId ? params.countryId : null;
	var toFind = {};
	id ? (toFind['id'] = id) : id;
	firstName ? (toFind['firstName'] = "'" + firstName + "'") : firstName;
	middleName ? (toFind['middleName'] = "'" + middleName + "'") : middleName;
	lastName ? (toFind['lastName'] = "'" + lastName + "'") : lastName;
	gender ? (toFind['gender'] = "'" + gender + "'") : gender;
	dob ? (toFind['dob'] = "'" + dob + "'") : dob;
	email ? (toFind['email'] = "'" + email + "'") : email;
	address ? (toFind['address'] = "'" + address + "'") : address;
	cellphone ? (toFind['cellphone'] = "'" + cellphone + "'") : cellphone;
	cityId ? (toFind['cityId'] = cityId) : cityId;
	stateId ? (toFind['stateId'] = stateId) : stateId;
	countryId ? (toFind['countryId'] = "'" + countryId + "'") : countryId;
	var k = lodash.keys(toFind);
	var v = lodash.values(toFind);
	var q = '';
	for (let i = 0; i < k.length; i++) {
		if (i === k.length - 1) q = q.concat(`u.${k[i]} = ${v[i]}`);
		else q = q.concat(`u.${k[i]} = ${v[i]} and `);
	}
	Users.findUsers()
		.then(() => {
			var dbConn = new sql.ConnectionPool(dbConfig);
			dbConn
				.connect()
				.then(() => {
					var request = new sql.Request(dbConn);
					var query = `select * from [andromedadb].dbo.Users as u where ${q}`;
					request
						.query(query)
						.then((result) => {
							res.send(result.recordset);
							dbConn.close();
						})
						.catch((err) => {
							next(err);
						});
				})
				.catch((err) => {
					console.log('Error on connection', err);
				});
		})
		.catch(function(response, err) {
			console.log('Error getting endpoint', response, err);
			utils.writeJson(res, response);
		});
};
