const mongoose = require('mongoose');

const { Schema } = mongoose;

const PageSchema = new Schema({
  pageID: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Page', PageSchema);
