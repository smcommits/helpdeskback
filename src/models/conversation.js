const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  title: {type: String}, 
  senderID: {type: String}, 
  messages: { type: Schema.ObjectId, ref: 'Message' }, 
  users: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Conversation', ConversationSchema)

