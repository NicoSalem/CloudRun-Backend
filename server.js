const express = require("express")
const app = express();
const https = require('https');

var cors = require('cors')
app.use(cors())

var port = process.env.PORT || 8080;

const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'groovy-autumn-290918:us-central1:cloudrun-demo-sql',
    database: 'guestbook',
    password: process.env.DB_PASS,
    port: 5432,
})

app.get("/", function(req, res) {
    pool.query('SELECT * FROM entries', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    res.send("hello from the backend");
});

app.get("/test", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", function(req, res) {
    
    pool.query('SELECT * FROM entries', (err, res) => {
        console.log(err, res)
        console.log("test")
        pool.end()
    })
    res.send("hello from the backend");
    res.json({"key" : "test value"})

});

app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});


