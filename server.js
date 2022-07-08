const express = require("express")
const app = express();
const https = require('https');

var cors = require('cors')
app.use(cors())


app.get("/", function(req, res) {
    res.send("hello from the backend");
});

app.get("/test", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", function(req, res) {
    res.json({"key" : "test value"})
});

app.listen(8081, function() {
    console.log("Server is listening in port 8081")
});
