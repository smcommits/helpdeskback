const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const MessagesSchema = new Schema({
  text: {type: String}, 
  senderID: {type: String}, 
  recieverID: {type: String}, 
  time: {type: String}, 
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' }, 
})

module.exports = mongoose.model('Message', MessagesSchema);
