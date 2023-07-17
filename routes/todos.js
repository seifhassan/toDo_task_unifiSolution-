const express = require('express');
const { todosController } = require('../controllers');
const { asycnWrapper } = require('../lib');
const { TodoValidator, validation } = require('../middleware/validation')

const router = express.Router();


router.get('/:id', validation(TodoValidator.idParam), async (req, res, next) => {
  const { params: { id }, body: { userId } } = req;
  const todo = todosController.getTodo(id, userId);
  const [error, data] = await asycnWrapper(todo);
  if (error) return next(error);
  return res.status(200).json(data);
});


router.post('/', validation(TodoValidator.addTodo), async (req, res, next) => {
  const {
    body: { title, status, tags, userId },
  } = req;
  const todo = todosController.create({
    title, status, tags, userId,
  });
  const [error, data] = await asycnWrapper(todo);
  if (error) return next(error);
  return res.status(200).json({
    message: 'Todo was Created successfully',
    todo: data,
  });
});


router.patch('/:id', validation(TodoValidator.update), async (req, res, next) => {
  const {
    body: { title, status, tags, userId },
    params: { id },
  } = req;

  const updatedTodo = todosController.updateById(id, {
    title, status, tags, userId,
  });
  const [error, data] = await asycnWrapper(updatedTodo);
  if (error) return next(error);
  if (!data) {
    return res.status(400).json('Todo Not Found');
  }
  return res.status(200).json({
    message: 'Todo was edited successfully',
    todo: data,
  });
});


router.delete('/:id', validation(TodoValidator.idParam), async (req, res, next) => {
  const {
    params: { id },
    body: { userId },
  } = req;
  const todo = todosController.deleteById(id, userId);
  const [error, data] = await asycnWrapper(todo);
  if (error) return next(error);
  if (!data) {
    return res.status(400).json('Todo Not Found');
  }
  return res.status(200).json({
    message: 'Todo was Deleted successfully',
    todo: data,
  });
});

module.exports = router;
