const express = require('express');
const { todosController } = require('../controllers');
const { asycnWrapper } = require('../lib');
const { TodoValidator, validation } = require('../middleware/validation')

const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  const { query: { limit, skip, status }} = req;
  const todos = todosController.get({ limit, skip, status },req.user.id);
  const [error, data] = await asycnWrapper(todos);
  if (error) return next(error);
  return res.status(200).json(data);
});

router.get('/:id', validation(TodoValidator.idParam), async (req, res, next) => {
  const { params: { id } } = req;
  const todo = todosController.getTodo(id, req.user.id);
  const [error, data] = await asycnWrapper(todo);
  if (error) return next(error);
  return res.status(200).json(data);
});


router.post('/', validation(TodoValidator.addTodo), async (req, res, next) => {
  const {
    body: { title, status, tags },
  } = req;
  const todo = todosController.create({
    title, status, tags,userId: req.user.id,
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
    body: { title, status, tags },
    params: { id },
  } = req;

  const updatedTodo = todosController.updateById(id, {
    title, status, tags, userId:req.user.id,
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
  } = req;
  const todo = todosController.deleteById(id, req.user.id);
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
