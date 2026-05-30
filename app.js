const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.set('view engine', 'ejs');

let tasks = [
  { id: 1, taskName: 'C257 CA1', deadline: '2026-06-01', priority: 'High', notes: 'Complete and submit on SA3.0' },
  { id: 2, taskName: 'B323 CA1', deadline: '2026-06-03', priority: 'Medium', notes: 'Complete powerpoint slides' },
  { id: 3, taskName: 'C240', deadline: '2026-06-04', priority: 'Low', notes: 'Think of a topic' }
];

app.get('/', function(req, res) {
    const search = req.query.search || '';
    let filteredTasks = tasks;

    if (search) {
        filteredTasks = tasks.filter(function(task) {
            return task.taskName.toLowerCase().includes(search.toLowerCase()) ||
                   task.priority.toLowerCase().includes(search.toLowerCase());
        });
    }

    res.render('index', { tasks: filteredTasks, search });
});

app.get('/tasks/:id', function(req, res) {
    const taskId = parseInt(req.params.id);
    const task = tasks.find((task) => task.id === taskId);

    if (task) {
        res.render('taskInfo', { task });
    } else {
        res.redirect('/');
    }
});

// Add a new task form
app.get('/tasks', function(req, res) {
    res.render('addTask');
});

// Add a new task
app.post('/tasks', function(req, res) {
    const { taskName, deadline, priority, notes } = req.body;
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, taskName, deadline, priority, notes };
    tasks.push(newTask);
    res.redirect('/');
});

// Update a task by ID
app.get('/tasks/:id/update', function(req, res) {
    const taskId = parseInt(req.params.id);

    const updateTask = tasks.find(function(task) {
        return task.id === taskId;
    });

    if (updateTask) {
        res.render('updateTask', { updateTask });
    } else {
        res.redirect('/');
    }
});

app.post('/tasks/:id/update', function(req, res) {
    const taskId = parseInt(req.params.id);
    const { taskName, deadline, priority, notes } = req.body;

    const updatedTask = { id: taskId, taskName, deadline, priority, notes };

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, ...updatedTask };
        }
        return task;
    });

    res.redirect('/');
});

// Delete a task by ID
app.get('/tasks/:id/delete', function(req, res) {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
