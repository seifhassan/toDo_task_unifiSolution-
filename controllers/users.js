const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Todo } = require('../models/todo');

const { JWT_SECRET = 'hashem' } = process.env;

const register = async (data) => {
  const user = await User.create(data);
  if (!user) {
    throw new Error('Register failed ');
  }
  const token = jwt.sign({ userName: user.userName, id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return {
    token,
    user,
  };
};

const login = async ({ userName, password }) => {
  const user = await User.findOne({ userName }).exec();
  if (!user) {
    throw new Error('Authentication failed ');
  }
  const valid = user.verfiyPassword(password);
  if (!valid) {
    throw new Error('Authentication failed ');
  }
  const token = jwt.sign({ userName, id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
};

const getFirstName = (id) => User.findById(id).select({ firstName: 1, _id: 0 });

const deleteById = async (id, userId) => {
  if (id !== userId) {
    throw new Error('Authentication failed ');
  }
  return User.findByIdAndRemove(id);
};

const updateById = async (id, userId, values) => {
  if (id !== userId) {
    throw new Error('Authentication failed ');
  }
  return User.findByIdAndUpdate(id, values, { returnDocument: 'after' });
};

const getUserTodos = async (id, userID) => {
  if (id !== userID) {
    throw new Error('Authentication failed ');
  }
  return Todo.find({ userId: id }).populate('userId');
};

module.exports = {
  register,
  login,
  getFirstName,
  deleteById,
  updateById,
  getUserTodos,
};
