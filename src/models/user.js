const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  facebookID: {type: String, required: true}, 
  name: {type: String, required: true}, 
  conversations: {type: Schema.ObjectId, ref: 'Conversation'}, 
  pages: {type: Schema.ObjectId, ref: 'Page'}
})

module.exports = mongoose.model('User', UserSchema)
