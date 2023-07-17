const express = require('express');
const todosRoutes = require('./todos');
const userRoutes = require('./users')
const router = express.Router();

router.use('/users', userRoutes);
router.use('/todos', todosRoutes);

module.exports = router;