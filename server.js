const express = require("express")
const app = express();
const https = require('https');

var cors = require('cors')
app.use(cors())

var port = process.env.PORT || 8080);

app.get("/", function(req, res) {
    res.send("hello from the backend");
});

app.get("/test", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", function(req, res) {
    res.json({"key" : "test value"})
});

app.listen(port, function() {
    console.log("Server is listening in port" + port)
});
