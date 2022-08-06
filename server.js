const express       = require("express")
const app           = express();
const https         = require('https');
const useragent     = require('express-useragent');
const cors          = require('cors')
const redis         = require('redis')

require('dotenv').config()

app.use(cors())
app.use(useragent.express())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

console.log(process.env)

var port = process.env.PORT || 8080;

var msgs_list = []
var redis_list = []

const { Pool } = require('pg')
const pool = new Pool({
    host: '/cloudsql/groovy-autumn-290918:us-central1:ford-cloudrun-demo-sql',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASS,
    database: 'guestbook'
    
})

const redis_client = redis.createClient({
  "host": process.env.REDIS_IP
  // "port": '6380'
});
redis_client.on("error", function(error) {
  console.error(error);
});


app.listen(port, function() {
    console.log("Server is listening in port: " + port)
});

app.get("/", function(req, res) {
    var browser = useragent.parse(req.headers['user-agent']);
    res.send(`hello from the LATEST backend, thanks for using ${browser.browser} ${browser.version} ${browser.source}`);
});

app.get("/rds", async function(req, res) {
  redis_client.set("first_key", "redis is working")
  await redis_client.get("first_key", (error, first_key)  => {
    redis_list.push(first_key);
    res.json(redis_list)
  });
});




app.get("/redis-data", async function(req, res) {
  redis_client.get("redis-pubsub-messages", (error, redis_pubsub_messages)  => {
    res.send(redis_pubsub_messages);
  });
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
    console.log(process.env.TEST)
    res.sendFile(__dirname + "/index.html");
});

app.get("/j", async function(req, res) {
    res.json({"key:" : process.env.TEST})
});


app.get("/pmsgs", async function(req, res) {
    res.send(msgs_list);
});


// retrieving pub sub messages with pull

const projectId = 'groovy-autumn-290918';
const subscriptionNameOrId = 'subs1';

// Imports the Google Cloud client library. v1 is for the lower level
// proto access.
const {v1} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use.
const subClient = new v1.SubscriberClient();

async function synchronousPull() {
  // The low level API client requires a name only.
  const formattedSubscription =
    subscriptionNameOrId.indexOf('/') >= 0
      ? subscriptionNameOrId
      : subClient.subscriptionPath(projectId, subscriptionNameOrId);

  // The maximum number of messages returned for this request.
  // Pub/Sub may return fewer than the number specified.
  const request = {
    subscription: formattedSubscription,
    maxMessages: 10,
  };

  // The subscriber pulls a specified number of messages.
  const [response] = await subClient.pull(request);
    pull_m_list = []
  // Process the messages.
  const ackIds = [];
  for (const message of response.receivedMessages) {
    console.log(`Received message: ${message.message.data}`);
    pull_m_list.push(`Received message from list: ${message.message.data}`)
    ackIds.push(message.ackId);
  }

  if (ackIds.length !== 0) {
    // Acknowledge all of the messages. You could also acknowledge
    // these individually, but this is more efficient.
    const ackRequest = {
      subscription: formattedSubscription,
      ackIds: ackIds,
    };

    await subClient.acknowledge(ackRequest);
  }

  console.log('Done.');
  return pull_m_list
}

// retrieving pub sub messages with pull
app.get("/pull-pubsub-msgs", async  function(req, res) {
    m = await synchronousPull().catch(console.error)
    console.log(m)
    res.send(m)
});

// get with push
app.post("/get-pubsub-msgs", async (req, res) => {
  console.log(req.body)
  pubsub_data = Buffer.from(req.body.message.data, 'base64').toString('utf8')
  msgs_list.push(pubsub_data);
  appendToRedis("redis-pubsub-messages", pubsub_data)
  res.status(200).send();
});

app.post("/get-pubsub-msgs2", (req, res) => {
  console.log(req.body.messages)
  res.send(req.body.messages);
});

async function appendToRedis(redis_variable, append_value){
  await redis_client.get(redis_variable, (error, reply1)  => {
    var current = reply1;
    var new_value = current + append_value;
    redis_client.set(redis_variable, new_value)
  });
}

redis_client.set("psub_messages", "")
app.get("/rds-test", async function(req, res) {
  appendToRedis('psub_messages', ' added');
  redis_client.get('psub_messages', (error, reply2)  => {
    res.send(reply2)
  });
});