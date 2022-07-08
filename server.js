const express = require("express")
const app = express();
const https = require('https');


app.get("/", function(req, res) {
    res.send("hello from the backend");
});

app.get("/test", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", function(req, res) {
    res.json({"key" : "value"})
});

app.listen(8080, function() {
    console.log("Server is listening in port 8080")
});
