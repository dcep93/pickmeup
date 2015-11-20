var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = Schema.Types.ObjectId;

var modelName = 'Pickmeup';

var pickmeupSchema = new Schema({
	creator: {ref: 'User', type: ObjectID, required: true},
	receiver: {ref: 'User', type: ObjectID, required: true},
	score: {type: Number, default: 1, required: true},
	text: {type: String, required: true},
	timestamp: {type: Date, default: Date.now, required: true},
	unlocked: {type: Boolean, default: false, required: true}
});

/*=== Static Methods ===*/

/**
 * Create pickmeup from params.creator_id to params.receiver_id with text params.text
 *   Assumes that authentication has already been done and that all users exist
 *
 * @param {object} params - Parameters of object:
 *   {string} creator - ObjectID of user creating pickmeup
 *   {string} receiver - ObjectID of user receiving pickmeup
 *   {string} text -  Text of pickmeup to be created
 * @param {function} callback - Callback function. Params: err, result
 */
pickmeupSchema.statics.createPickmeup = function(params, callback) {
	var User = mongoose.model('User');
	var Pickmeup = mongoose.model(modelName);
	User.findOne({_id: params.creator_id}, function(err, creator) {
		if (err) {
			callback(err);
		}

		else if(!creator){
			callback('Creator does not exist', null, 400);
		}

		else{
			User.findOne({_id: params.receiver_id}, function(err, receiver) {
				if (err) {
					callback(err);
				}

				else if(!receiver){
					callback('Receiver does not exist', null, 400);
				}

				else{
					var newPickmeup = new Pickmeup({
						creator: creator._id,
						receiver: receiver._id,
						text: params.text
					});
					
					creator.authorPickmeup(newPickmeup._id);
					receiver.receivePickmeup(newPickmeup._id);
					creator.incKarma(newPickmeup.score);

					newPickmeup.save(callback);
				}
			});
		}
	});
};

/*
 * Gets a pickmeup by id or returns an error, it will give null instead of pickmeup if no pickmeup matches the criteria.
 *
 * @param {number} _id - id of the pickmeup
 */
pickmeupSchema.statics.getById = function(id, callback) {
	this.findOne({_id: id}, callback);
}



/*=== Instance Methods ===*/

/**
 * Unlock a pickmeup and allow author to view it.
 *
 * @param {function} callback - Callback function. Params: err, result
 */
pickmeupSchema.methods.unlock = function(callback) {
	this.populate('receiver', function(err, self) {
		if (err) {
			callback(err);
		}
		else{
			self.unlocked = true;
			self.receiver.incKarma(-1);
			self.save(function(err, docs) {
				callback(err, {
					_id: docs._id, 
					text: docs.text, 
					receiver: docs.receiver, 
					unlocked: docs.unlocked, 
					score: docs.score,
					timestamp: docs.timestamp})
			});
		}
	});
};


/**
 * Modify a Pickmeup's score and that of its creator
 *
 * @param {number} score - How much to modify the score of this pickmeup by
 * @param {function} callback - Callback function. Params: err, result
 */
pickmeupSchema.methods.vote = function(score, callback) {
	this.populate('creator', function(err, self) {
		if (err) {
			callback(err);
		}
		else{
			self.score += score;
			self.creator.incKarma(score);
			self.save(function(err, docs) {
				callback(err, {_id: docs._id, text: docs.text, receiver: docs.receiver, unlocked: docs.unlocked, score: docs.score})
			});
		}
	});
};

module.exports = mongoose.model(modelName, pickmeupSchema);