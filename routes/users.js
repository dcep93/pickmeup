var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Pickmeup = require('../models/Pickmeup');




/*=== Helper functions ===*/

function returnJson(res, docs, err, status) {
	if(err){
		failureJson(res, status ? status : 500, err.message);
	}
	else{
		successJson(res, docs);
	}
}

function failureJson(res, status, err_message) {
	res.status(status).json({success: false, status: status, err: err_message});
}

function successJson(res, docs) {
	res.json({success: true, content: docs});
}


/*=== HTTP Requests ===*/


/* User requests */

// GET all users
router.get('/', function(req, res) {
	User.getAllUsers(function(err, users){
		if(err){
			failureJson(res, 400, err.message);
		}
		else{
			var display_users = users.map(function(user){return user.hidePassword()})
			returnJson(res, display_users, err);
		}
	});
});

// POST create a user
router.post('/', function(req, res) {
	User.createUser(req.body.username, req.body.password, function(err, user) {
		if(err){
			if(err.code === 11000 || err.code === 11001){
				//11000 and 11001 are codes indicating user already exists
				failureJson(res, 400, 'Username already exists');
			}
			else{
				failureJson(res, 400, err.message);
			}
		}
		else{
			req.session.user_id = user._id;
			successJson(res, user.hidePassword());
		}
	});
});

// GET user information, returns null if user does not exists and also populates the pickmeups
router.get('/:user_id', function(req, res) {
	User.getById(req.params.user_id, function(err, user) {
		if(err){
			failureJson(res, 500, err.message);
		}
		else if(!user){
			failureJson(res, 400, 'User not found');
		}
		else{
			user.populatePickmeups(function(err, user) {
				returnJson(res, user.hidePassword(), err);
			});
		}
	});
});



/* User Login/Logout */

// POST user login
router.post('/login', function(req,res) {
	User.getByUsername(req.body.username, function(err, user) {
		if(err){
			failureJson(res, 500, err.message);
		}
		else if(!user){
			failureJson(res, 400, 'User does not exist');
		}
		else{
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				if(err){
					failureJson(res, 500, err.message);
				}
				else if(result){
					req.session.user_id = user._id;
					user.populatePickmeups(function(err, user) {
						returnJson(res, user, err);
					});
				}
				else{
					failureJson(res, 400, 'Wrong Password');
				}
			});
		}
	});
});

// POST user logout
router.post('/logout', function(req,res) {
	delete req.session.user_id;
	successJson(res, {});
});



/* Pickmeup requests */

// GET the list of ids of the user's pickmeups received and populate the unlocked attribute
router.get('/:user_id/pickmeups/', function(req, res) {

	User.getById(req.params.user_id, function(err, user) {
		if(err){
			failureJson(res, 500, err.message);
		}
		else if(!user){
			failureJson(res, 400, 'User not found');
		}
		else{
			user.populatePickmeups(function(err, user){
				returnJson(res, user.pickmeups_received, err);
			});	
		}
	});
});

// GET the specific pickmeup only if its unlocked.
router.get('/:user_id/pickmeups/:pickmeup_id', function(req, res) {
	var user_id = req.params.user_id;
	var pickmeup_id = req.params.pickmeup_id;
	if(req.session.user_id !== user_id){
		failureJson(res, 403, 'User not logged in');
	}
	else{
		Pickmeup.findOne({_id: req.params.pickmeup_id}, function(err, pickmeup) {
			if(err){
				failureJson(res, 500, err.message);
			}
			else if(!pickmeup){
				failureJson(res, 400, 'Pickmeup not found');
			}
			else if (!pickmeup.unlocked) {
				failureJson(res, 403, 'Pickmeup not unlocked');
			}
			else {
				successJson(res, pickmeup);
			}
		});
	}
});

// PUT unlock the pickmeup if user is authorized, user has enough karma, and the pickmeup is not already unlocked.
router.put('/:user_id/pickmeups/:pickmeup_id/unlock', function(req, res) {
	var user_id = req.params.user_id;
	
	if(req.session.user_id !== user_id){
		failureJson(res, 403, 'User is not logged in');
	}
	else{
		User.getById(user_id, function(err, user) {
			if (!user.hasKarma()) {
				failureJson(res, 403, 'User has insufficient karma');
			}
			else if(err){
				failureJson(res, 500, err.message);
			}
			else {
				var pickmeup_id = req.params.pickmeup_id;
				Pickmeup.findOne({_id:pickmeup_id}, function(err, pickmeup){
					if(err){
						failureJson(res, 500, err.message);
					}
					else if(!pickmeup){
						failureJson(res, 400, 'Pickmeup not found');
					}
					else if(pickmeup.unlocked){
						failureJson(res, 400, 'Pickmeup already unlocked');
					}
					else{
						pickmeup.unlock(function(err, pickmeup){
							returnJson(res, pickmeup, err);
						});
					}
				})
			}
		});
	}
});

// PUT check if pickmeup is unlocked and user is authorized, then vote on the pickmeup
router.put('/:user_id/pickmeups/:pickmeup_id/vote', function(req, res) {
	var user_id = req.params.user_id;
	if(req.session.user_id != user_id){
		failureJson(res, 403, 'User is not logged in');
	}
	else{
		var pickmeup_id = req.params.pickmeup_id;
		Pickmeup.findOne({_id:pickmeup_id}, function(err,pickmeup) {
			if(err){
				failureJson(res, 500, err.message);
			}
			else if(!pickmeup){
				failureJson(res, 400, 'Pickmeup not found');
			}
			else if(pickmeup.receiver != user_id) {
				failureJson(res, 400, 'User did not receive pickmeup');
			}
			else if(!pickmeup.unlocked) {
				failureJson(res, 403, 'Pickmeup not unlocked');
			}
			else {
				var val = 0;
				switch(req.body.voting_direction){
					// if user tries to upvote twice, no effect for second attempt
					case "up": val = 5 - pickmeup.score; break;
					case "down": val = -3 - pickmeup.score; break;
					default: val = 1 - pickmeup.score;
				}
				pickmeup.vote(val, function(err, pickmeup){returnJson(res, pickmeup, err)})
			}
		});
	}
});

// POST give this user a pickmeup
router.post('/:user_id/pickmeups/', function(req, res) {
	var creator_id = req.session.user_id;

	if(!creator_id) {
		failureJson(res, 403, 'User not logged in');
	}

	else{
		var params = {creator_id: creator_id, receiver_id: req.params.user_id, text: req.body.text };
		Pickmeup.createPickmeup(params, function(err, pickmeup, status){
			returnJson(res, pickmeup, err, status);
		});
	}
});

module.exports = router;
