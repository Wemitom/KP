const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv/config.js');
const { default: isImageURL } = require('image-url-validator');

const ArticleSchema = new Schema({
  title: {
    type: String,
    default: 'New Article',
    required: true,
    minLength: 5,
    maxLength: 60,
  },
  author: { type: String, required: true },
  body: String,
  description: { type: String, required: true, minLength: 1, maxLength: 70 },
  comments: [{ body: String, date: Date, author: String }],
  date: { type: Date, default: Date.now },
  imgURL: {
    type: String,
    required: true,
    validate: {
      validator: async (value) => {
        return await isImageURL(value);
      },
      message: 'Not an img',
    },
  },
  hidden: Boolean,
});

const ArticleModel = mongoose.model('Articles', ArticleSchema);

module.exports = ArticleModel;
