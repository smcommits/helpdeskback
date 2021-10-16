const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const MessagesSchema = new Schema({
  text: {type: String}, 
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' }, 
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Message', MessagesSchema);
