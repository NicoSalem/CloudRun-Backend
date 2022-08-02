const express = require("express")
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
var useragent = require('express-useragent');

var cors = require('cors')
app.use(cors(), useragent.express(), bodyParser.urlencoded({ extended: true }))

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});

var msgs_list = []


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


app.get("/pmsgs", function(req, res) {
    console.log('msgs')
    res.send(msgs_list)
    // console.log(msgs_list)
    // for (const key in msgs_list) {
    //     console.log(key)
    // }
    // // res.send(`messages ${msgs_list}`)
});

// retrieving pub sub messages with pull
app.get("/pull-pubsub-msgs", function(req, res) {

});

// get with push
app.post("/get-pubsub-msgs", jsonBodyParser, (req, res) => {
        const message = Buffer.from(req.body.message.data, 'base64').toString(
            'utf-8'
        );

        msgs_list.push("message");

        res.status(200).send();

    });
