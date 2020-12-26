const Question = require('./Question');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Please provide a content.'],
    minlength: [10, 'Please provide a content at least 10 characters.'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],

  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  question: {
    type: mongoose.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
});

// Hooks
AnswerSchema.pre('save', async function (next) {
  if (!this.isModified('user')) return next();

  try {
    const answerId = this._id;
    const questionId = this.question;

    const question = await Question.findById(questionId);

    question.answers.push(answerId);
    question.answerCount = question.answers.length;
    await question.save();

    return next();
  } catch (err) {
    return next(err);
  }
});

AnswerSchema.post('remove', async function () {
  const answerId = this._id;
  const questionId = this.question;

  try {
    const question = await Question.findById(questionId);

    question.answers.splice(question.answers.indexOf(answerId), 1);
    question.answerCount = question.answers.length;
    await question.save();
  } catch (error) {
    next(err);
  }
});

module.exports = mongoose.model('Answer', AnswerSchema);
