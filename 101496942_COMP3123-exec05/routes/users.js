const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const userFilePath = path.join(__dirname, '..', 'user.json');

// Return all details from user.json file to client as JSON format
router.get('/profile', (req, res, next) => {
    fs.readFile(userFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        try {
            const user = JSON.parse(data);
            res.json(user);
        } catch (parseErr) {
            next(parseErr);
        }
    });
});

// Modify /login router to accept username and password as JSON body parameter
router.post('/login', (req, res, next) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ status: false, message: 'username and password required' });
    }

    fs.readFile(userFilePath, 'utf8', (err, data) => {
        if (err) return next(err);
        try {
            const user = JSON.parse(data);
            if (user.username !== username) {
                return res.json({ status: false, message: 'User Name is invalid' });
            }
            if (user.password !== password) {
                return res.json({ status: false, message: 'Password is invalid' });
            }
            return res.json({ status: true, message: 'User Is valid' });
        } catch (parseErr) {
            next(parseErr);
        }
    });
});

// Modify /logout route to accept username as parameter and display message
// in HTML format like <b>${username} successfully logout.<b>
router.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.<b>`);
});

module.exports = router;