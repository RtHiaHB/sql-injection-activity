const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const app = express()
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:')
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)")
    db.run("INSERT INTO user VALUES ('TomD1969', 'whocares', 'Code God')")
})

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const query = 'SELECT title FROM user WHERE username = "' + username + '" AND password = "'+ password + '";'
    console.log(`Username: ${username}`)
    console.log(`Password: ${password}`)
    console.log(`Query: ${query}`)
    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err)
        } else if (!row) {
            res.redirect('/index.html#unauthorized')
        } else {
            res.send(`Hello <b>${row.title}!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /><a href="/index.html">Go back to login</a>`)
        }
    })
})

app.listen(3000, console.log('Listening on port 3000'))