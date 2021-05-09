const mongoose = require('mongoose');
const { Schema } = mongoose;
require('./Article');
require('dotenv/config.js');
const { default: isImageURL } = require('image-url-validator');

const CategorySchema = new Schema({
  title: {
    type: String,
    default: 'New Category',
    required: true,
    minLength: 5,
    maxLength: 60,
    unique: true,
  },
  description: { type: String, required: true, minLength: 5, maxLength: 60 },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Articles' }],
  imgURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        if (value !== null) {
          isImageURL(value);
        } else {
          Promise.resolve(true);
        }
      },
      message: 'Not an img',
    },
  },
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
