const express = require ('express');
const bodyParser = require('body-parser');
const app = express ();
const port = 3000;

let users = [];

app.use(bodyParser.json());

// get all
app.get('/users', (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        res.status(500).json({message : 'Error retrieving users', error : error.message});
    }
});
//get one
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id == id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

//create or register a new user
app.post('/users', (req, res) => {
    try {
        const user = req.body;
        if (!user || !user.id || !user.name) {
            return res.status(400).json({ message: 'User must have an id and name' });
        }
        users.push(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});

//update user
app.put('/users/:id', (req,res) => {
    const {id} = req.params;
    const user = req.body;
    users = users.map(u => (u.id == id ? user : u));
    res.json(user);
});

//delete user
app.delete('/users/:id', (req,res) => {
    const {id} = req.params;
    users = users.filter(u => u.id != id);
    res.status(204).end();
});

//search users
app.get('/users/search', (req,res) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).send({message: "Name query parameter is required"});

    }
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
    res.json(filteredUsers);
});

//start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});