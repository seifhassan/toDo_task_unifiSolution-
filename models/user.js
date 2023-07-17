const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // eslint-disable-next-line no-param-reassign
        delete ret.password;
      },
    },
  },
);
userSchema.pre('save', function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.verfiyPassword = function verfiyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
