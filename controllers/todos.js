const { Todo } = require('../models/todo');

const create = async (todo) => {

  return Todo.create(todo);
};



const getTodo = async (id,userId) => { 
  const todo = await Todo.findById(id);
  if (!todo) {
    throw new Error('Todo not found ');
  }
  if (!todo.userId.equals(userId)) {
    throw new Error('UN_Authorize to Edit');
  }
 return todo;
} 


const updateById = async (id, values) => {
  const todo = await Todo.findById(id);
  if (!todo) {
    throw new Error('Todo not found ');
  }
  if (!todo.userId.equals(values.userId)) {
    throw new Error('UN_Authorize to Edit');
  }
  // return todo.updateOne(values, { returnDocument: 'after', runValidators: true });
  return Todo.findByIdAndUpdate(id, values, { returnDocument: 'after', runValidators: true });
};

const deleteById = async (id, userId) => {
  const todo = await Todo.findById(id);
  if (!todo) {
    throw new Error('Todo not found ');
  }
  if (!todo.userId.equals(userId)) {
    throw new Error('UN_Authorize to Edit');
  }
  return Todo.findByIdAndRemove(id);
};

module.exports = {
  create,
  updateById,
  deleteById,
  getTodo,
};
