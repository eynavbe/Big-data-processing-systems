const redis = require('redis')
const fs = require('fs');

async function run() {
const client = redis.createClient({
url: 'redis://localhost:6379',
});

await client.connect();

console.log(client.isOpen); // this is true

fs.readFile('BSC.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
}

    try {
        const starsList = JSON.parse(data);
// Store each star in Redis with "harvard_ref_#" as the key
        starsList.forEach((star) => {
            const { "harvard_ref_#": harvardRef, ...starData } = star;
            const key = `harvard_ref_#:${harvardRef}`;
// Store star data in Redis
            client.set(key, JSON.stringify (starData));
            if (err) {
              console.error('Error storing data in Redis:', err);
            } else {
              console.log(`Data stored in Redis with key: ${key}`);
            }
          });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      } finally {
        console.log('Finished storing data in Redis');
        client.quit(); // Close the Redis connection after storing the data
      }
    });
  }
  
  run();