const express = require("express")
const app = express();
const https = require('https');
var useragent = require('express-useragent');

var cors = require('cors')
app.use(cors(), useragent.express())

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});


const { Pool } = require('pg')
const pool = new Pool({
    host: '/cloudsql/groovy-autumn-290918:us-central1:ford-cloudrun-demo-sql',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASS,
    database: 'guestbook',
    
})

app.get("/", function(req, res) {
    var browser = useragent.parse(req.headers['user-agent']);
    res.send(`hello from the backend1, thanks for using ${browser.browser} ${browser.version} ${browser.source}`);
});


app.get("/db", async(req, res) => {
    console.log("db1")
    try {
        const allItems = await pool.query('SELECT * from entries')
        console.log('db2')
        res.json(allItems.rows);
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

// recieveing pub sub messages

app.post('/pubsub', (req, res) => {
    if (!req.body) {
      const msg = 'no Pub/Sub message received';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format';
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
  
    const pubSubMessage = req.body.message;
    const messageData = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
      : 'no message';
  
    console.log(`${messageData}!`);
    res.status(204).send();
  });
