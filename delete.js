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

  // Process the messages.
  const ackIds = [];
  for (const message of response.receivedMessages) {
    console.log(`Received message: ${message.message.data}`);
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
}

// synchronousPull().catch(console.error);

// function decode(s){
//   console.log(s)
//   console.log(Buffer.from(s, 'base64').toString('utf8'))
// }

// decode("aGVsbG8gZnJvbSBwdWJzdWI=")


console.log(2)