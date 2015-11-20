var express = require('express');
var router = express.Router();
var Pickmeup = require('../models/Pickmeup');
var User = require('../models/User');
/* GET home page. */
router.get('/test', function(req, res) {
  res.render('test');
});

router.get('/', function(req, res) {
  res.render('index');
});

/* GET clear database for testing */
router.get('/clear', function(req, res) {
	if(req.query.password == 'cleardb'){
		User.remove({}, function(){});
		Pickmeup.remove({}, function(){});
	}
	res.redirect('./');
})

module.exports = router;
