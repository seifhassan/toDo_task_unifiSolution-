const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const { asycnWrapper } = require('../lib');

const { JWT_SECRET = 'hashem' } = process.env;

const asyncVerify = promisify(jwt.verify);

const auth = async (req, res, next) => {
  const { headers: { authorization } } = req;
  const payload = asyncVerify(authorization, JWT_SECRET);
  const [error, data] = await asycnWrapper(payload);
  if (error) {
    return next(error);
  }
  const user = await User.findById(data.id);
  if (!user) {
    return next(new Error('user Not found '));
  }
  req.user = user;
  return next();
};

module.exports = {
  auth,
};
