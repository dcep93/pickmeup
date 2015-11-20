var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;




/*=== Schema ===*/

var userSchema = new Schema({
	karma: { type: Number, default: 1 },
	password: { type: String, required: true },
	pickmeups_authored: [{ type: ObjectId, ref: 'Pickmeup' }],
	pickmeups_received: [{ type: ObjectId, ref: 'Pickmeup' }],
	username: { type: String, required: true, unique: true }
});




/*=== Static Methods ===*/

/*
 * Creates a new user if all the mongoose validations are passed and then calls the callback
 * 
 * @param {string} username - Username of the new user
 * @param {string} password - Password of the new user
 * @param {function} callback - Callback to be executed after query
 */
userSchema.statics.createUser = function(username, password, callback) {
	var User = this;
	bcrypt.hash(password, 8, function(err, hash) {
		var user = new User({
			username: username,
			password: hash
		});
		user.save(callback);
	});
};

/*
 * Gets a user by id or returns an error, it will give null instead of user if no user matches the criteria.
 *
 * @param {number} id - _id of the user
 */
userSchema.statics.getById = function(id, callback) {
	this.findOne({_id: id}, callback);
};

/*
 * Gets a list of all the users
 */
userSchema.statics.getAllUsers = function(callback) {
	this.find({}, callback);
};

/*
 * Gets a user by username or returns an error, it will give null instead of user if no user matches the criteria.
 * @param {string} username - username of the user
 */
userSchema.statics.getByUsername = function(username, callback) {
	this.findOne({username:username}, callback);
}


/*=== Instance Methods ===*/

/*
 * Increments the users karma score by the amount given
 * 
 * @param {integer} value - amount to increment karma by 
 */
userSchema.methods.incKarma = function(value, callback) {
	this.karma += value;
	this.save(callback);
};

/*
 * Adds a pickmeup to the authored list
 *
 * @param {integer} pickmeup_id - id of the pickmeup being authored
 */
userSchema.methods.authorPickmeup = function(pickmeup_id, callback) {
	this.pickmeups_authored.push(pickmeup_id);
	this.save(callback);
};

/*
 * Adds a pickmeup to the received list
 * @param {integer} pickmeup_id - id of the pickmeup being received
 */
userSchema.methods.receivePickmeup = function(pickmeup_id, callback) {
	this.pickmeups_received.push(pickmeup_id);
	this.save(callback);
};

/*
 * Populates the list of unlocked pickmeups
 */
userSchema.methods.populatePickmeups = function(callback){
	this.populate({
		path: 'pickmeups_received', 
		select: 'unlocked timestamp'
	}, callback);
};

userSchema.methods.hasKarma = function() {
	return this.karma > 0;
};

userSchema.methods.hidePassword = function() {
	var display = {};
	var display_keys = ['_id','karma','username','pickmeups_received','pickmeups_authored'];
	for(var i in display_keys){
		var key = display_keys[i];
		display[key] = this[key];
	}
	return display;
}

module.exports = mongoose.model('User', userSchema);
