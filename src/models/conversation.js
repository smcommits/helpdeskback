const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConversationSchema = new Schema({
  title: { type: String },
  pageID: { type: String },
  messages: { type: Schema.ObjectId, ref: 'Message' },
  user: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
