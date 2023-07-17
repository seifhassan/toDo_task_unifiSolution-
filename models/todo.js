const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'inprogress', 'done'],
    },
    tags: {
      type: String,
      maxlength: 20,
    },
    id: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      // ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);


const Todo = mongoose.model('Todo', todoSchema);

module.exports = {
  Todo
};
