const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

// Schema
const QuestionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    minlength: [10, 'Please provide a title at least 10 characters.'],
    unique: true,
  },

  content: {
    type: String,
    required: [true, 'Please provide a content.'],
    minlength: [20, 'Please provide a content at least 20 characters.'],
  },

  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],

  likeCount: {
    type: Number,
    default: 0,
  },

  answers: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Answer',
    },
  ],

  answerCount: {
    type: Number,
    default: 0,
  },

  slug: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

// Hooks
QuestionSchema.pre('save', function (next) {
  if (!this.isModified('title')) next();

  this.slug = this.makeSlug();
  next();
});

// Methods
QuestionSchema.methods.makeSlug = function () {
  return slugify(this.title, {
    replacement: '-',
    remove: /[*+~.()'"!:@/]/g,
    lower: true,
  });
};

module.exports = mongoose.model('Question', QuestionSchema);
