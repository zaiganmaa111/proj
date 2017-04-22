var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

router.get('/', function (req, res) {
	mongoHelp.mongoFindAll("FAULT_TEST", function (result) {
		res.render("con_overview", {FAULT_TEST: result});
		//res.send(result);
	});
});

module.exports = router;