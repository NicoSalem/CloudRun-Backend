const express       = require("express")
const app           = express();
const https         = require('https');
const useragent     = require('express-useragent');
const cors          = require('cors')

app.use(cors())
app.use(useragent.express())
app.use(express.json());
app.use(express.urlencoded({extended: true}));


var port = process.env.PORT || 8080;

var msgs_list = ["test"]

const { Pool } = require('pg')
const pool = new Pool({
    host: '/cloudsql/groovy-autumn-290918:us-central1:ford-cloudrun-demo-sql',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASS,
    database: 'guestbook',
    
})

app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});

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


app.get("/pmsgs", async function(req, res) {
    res.send(msgs_list);
});

// retrieving pub sub messages with pull
app.get("/pull-pubsub-msgs", function(req, res) {

});

// get with push
app.post("/get-pubsub-msgs", (req, res) => {
    const message = Buffer.from(req.body.messages.data, 'base64').toString('utf8');
    msgs_list.push(message);
    res.status(200).send();
});


app.post("/get-pubsub-msgs2", (req, res) => {
    res.send(req.body.messages);
});