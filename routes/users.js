var express = require('express');
var router = express.Router();
var dbConfig = require('../dbConfig');
var sql = require('mssql');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('users endpoint');
});

router.get('/api/v1/test', (req, res) => {
	var dbConn = new sql.ConnectionPool(dbConfig);
	dbConn
		.connect()
		.then(() => {
			var request = new sql.Request(dbConn);
			request
				.query('select * from andromedadb.dbo.test')
				.then((resp) => {
					console.log(resp);
					res.send(resp);
					dbConn.close();
				})
				.catch((err) => {
					console.log('err', err);
				});
		})
		.catch((err) => {
			console.log('err2', err);
		});
});

module.exports = router;
