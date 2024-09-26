const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const Todo = require("./models/todo");
const app = express();

app.use(express.json()); // Use express.json() for JSON body parsing
app.use(cors());

mongoose.connect("mongodb://localhost:27017/MERN-TODO", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error("Failed to connect to DB:", err));

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Add a new todo
app.post('/todos/new', async (req, res) => {
    try {
        if (!req.body.text) {
            return res.status(400).json({ error: 'Text field is required' });
        }

        const todo = new Todo({
            text: req.body.text,
            completed: false,
        });

        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error("Error saving todo:", err);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// Delete a todo
app.delete('/todo/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Toggle completion status
app.put('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            todo.completed = !todo.completed;
            const updatedTodo = await todo.save();
            res.json(updatedTodo);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

app.listen(4000, () => {
    console.log("Server started at port 4000");
});
