
const faker = require('faker');
const User  = require('./models/user');
const {Todo} = require('./models/todo');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl)
.then(()=>console.log('conected'))
.catch((error)=>console.log(error));

async function generateTodos() {

    const users = await User.find().select('_id');

    const Todos = [];


    for (let i = 0; i < 40; i++) {
        const title = faker.lorem.sentence(2);
        const status = 'new';
        const tags = faker.lorem.word();
        const userId = faker.random.arrayElement(users);
        Todos.push({
            title,
            status,
            tags,
            userId,
        });
    }
    await Todo.deleteMany({});
    Todo.insertMany(Todos)
    .then(docs => console.log(`${docs.length} todos have been inserted into the database.`))
    .catch(err => {
        console.error(err);
    });
};


generateTodos();