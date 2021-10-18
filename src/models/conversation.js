const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  title: {type: String}, 
  senderID: {type: String}, 
  pageID: {type: String}, 
  messages: { type: Schema.ObjectId, ref: 'Message' }, 
  reciever: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Conversation', ConversationSchema)

