const express = require('express');
const todosRoutes = require('./todos');

const router = express.Router();

router.use('/todos', todosRoutes);

module.exports = router;
