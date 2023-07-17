const { Todo } = require('../models/todo');

const create = async (todo) => {

  return Todo.create(todo);
};

const get = async (filters,userId) => { 
  const query={userId:userId};
  if(filters.status){
    query.status = filters.status
  }
 return await Todo.find(query)
  .skip(filters.skip || 0)
  .limit(filters.limit > 0 && filters.limit < 10 ? filters.limit : 10)
  .populate('userId')
  .exec();
} 




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
  get,
};
