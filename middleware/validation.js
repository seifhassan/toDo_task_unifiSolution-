const Joi = require("joi");

const validation = (schema) => async (req, res, next) => {
  const validationErr = [];
  ["body", "params", "query"].forEach((key) => {
    if (schema[key]) {
      const validations = schema[key].validate(req[key]);
      if (validations.error) {
        validationErr.push(validations.error);
      }
    }
  });
  if (validationErr.length > 0) {
    next(
      new Error(
        `validation error ${validationErr[0].details[0].message}`,
        422
      )
    );
  } else {
    next();
  }
};

const UsersValidator = {
  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  },
  signUp: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      firstName: Joi.string().required().min(3).trim(),
      lastName: Joi.string().required().min(3).trim(),
      DOB: Joi.date().required(),
      gender: Joi.string().valid("Male", "Female").required(),
    }),
  },
};
const TodoValidator = {
  addTodo: {
    body: Joi.object().keys({
      title: Joi.string().required().min(3).trim(),
      status: Joi.string().valid("new","inprogress", "done").required(),
      tags: Joi.array().items(Joi.string().required()).required(),
      userId: Joi.string().required(),
    }),
  },
  getTodo: {
    body: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  },
  // idParam: {
  //   params: Joi.object().keys({
  //     id: Joi.string().required(),
  //   }),
 // },
  update: {
    body: Joi.object().keys({
      title: Joi.string().min(3).trim(),
      status: Joi.string().valid("pending", "completed"),
      tags: Joi.array().items(Joi.string().required()),
      userId: Joi.string(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  idParam: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  },
};

module.exports = {
  validation,
  UsersValidator,
  TodoValidator,
};
