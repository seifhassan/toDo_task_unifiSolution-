const express = require('express');
const { usersController } = require('../controllers');
const { asycnWrapper } = require('../lib');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Regiser User
router.post('/', async (req, res, next) => {
  const {
    body:
     {
       userName, firstName, lastName, dob, password,
     },
  } = req;
  const user = usersController.register(
    {
      userName, firstName, lastName, dob, password,
    },
  );
  const [error, data] = await asycnWrapper(user);
  if (error) return next(error);
  return res.status(200).json(data);
});

// login User
router.post('/login', async (req, res, next) => {
  const {
    body:
     {
       userName, password,
     },
  } = req;
  const user = usersController.login(
    {
      userName, password,
    },
  );
  const [error, data] = await asycnWrapper(user);
  if (error) return next(error);
  return res.status(200).json({
    token: data,
  });
});

// Get FristName
router.get('/', auth, async (req, res, next) => {
  const users = usersController.getFirstName(req.user.id);
  const [error, data] = await asycnWrapper(users);
  if (error) return next(error);
  return res.status(200).json(data);
});

// Delete By Id
router.delete('/:id', auth, async (req, res, next) => {
  const {
    params: {
      id,
    },
  } = req;
  const user = usersController.deleteById(id, req.user.id);
  const [error, data] = await asycnWrapper(user);
  if (error) return next(error);
  if (!data) {
    res.status(400).json('User Not Found');
  }
  return res.status(200).json({
    message: 'User was Deleted successfully',
    user: data,
  });
});

// Update By Id
router.patch('/:id', auth, async (req, res, next) => {
  const {
    body:
     {
       userName, firstName, lastName, dob,
     },
    params: {
      id,
    },
  } = req;

  const updatedUser = usersController.updateById(id, req.user.id, {
    userName, firstName, lastName, dob,
  });
  const [error, data] = await asycnWrapper(updatedUser);
  if (error) return next(error);
  if (!data) {
    return res.status(400).json('User Not Found');
  }
  return res.status(200).json({
    message: 'User was edited successfully',
    user: data,
  });
});

// Get the todos of specific user
router.get('/:id/todos', auth, async (req, res, next) => {
  const {
    params: {
      id,
    },
  } = req;
  const todo = usersController.getUserTodos(id, req.user.id);
  const [error, data] = await asycnWrapper(todo);
  if (error) return next(error);
  if (!data) {
    return res.status(400).json('Todo Not Found');
  }
  return res.status(200).json({
    todo: data,
  });
});

module.exports = router;
