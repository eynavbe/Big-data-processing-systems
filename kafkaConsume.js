const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const { Client } = require('@elastic/elasticsearch');

// Kafka configuration
const kafkaConf = {
  "group.id": "zadgcfjl-astro",
  "metadata.broker.list": "dory.srvs.cloudkafka.com:9094",
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-512",
  "sasl.username": "zadgcfjl",
  "sasl.password": "8F5jtP461cb2DAz_JmDWmIG6hZqifw23",
  "debug": "generic,broker,security"
};

// Elasticsearch configuration
const elasticConf = {
  node: 'http://localhost:9200', // Update with your Elasticsearch host and port
};

const topic = `zadgcfjl-astro`;
const producer = new Kafka.Producer(kafkaConf);

// Elasticsearch client
const client = new Client({ node: elasticConf.node });

// Create Elasticsearch index and document
async function indexDocument(document) {
  const indexName = 'astro'; // Replace with your desired index name
  const docType = '_doc'; // Elasticsearch 7.x removed document types, use '_doc' for version 7.x

  try {
    const response = await client.index({
      index: indexName,
      type: docType,
      body: document,
    });

    if (response.statusCode === 201) {
      console.log('Document indexed successfully-check');
      console.log(document);
      console.log('Document indexed successfully');
    } else {
      console.log('Failed to index document.');
    }
  } catch (error) {
    console.error('Error indexing document:', error);
  }
}

// Kafka consumer
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, { "auto.offset.reset": "beginning" });

consumer.on("error", function (err) {
  console.error(err);
});
consumer.on("ready", function (arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on("data", async function (m) {
   const message = JSON.parse(m.value.toString());
  // console.log(message);

  // Index the message document to Elasticsearch
  await indexDocument(message);
});

consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function (log) {
  console.log(log);
});
consumer.connect();
