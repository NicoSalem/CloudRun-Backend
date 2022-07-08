const express = require("express")
const app = express();
const https = require('https');

var cors = require('cors')
app.use(cors())

var port = process.env.PORT || 8080;

const { Pool } = require('pg')
const pool = new Pool({
    host: '/cloudsql/groovy-autumn-290918:us-central1:cloudrun-demo-sql',
    port: 5432,
    user: 'postgres',
    password: '12345',
    database: 'guestbook',
    
})

const query = async () => {
    const q =  await pool.query('SELECT * from entries', (err, res) => {
        console.log(err, res)
        pool.end()
      })
}




app.get("/", function(req, res) {
    res.send("hello from the backend1");
});


app.get("/db", async(req, res) => {
    console.log("db1")
    try {
        const allItems = await pool.query('SELECT * from entries')
        console.log('db2')
        res.json();
    } 
    catch (err){
        console.log(err.message)
    }
});

app.get("/test", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", async function(req, res) {
    res.json({"key" : "test value"})
});

app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});


