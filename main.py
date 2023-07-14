import random
import datetime
import pytz
import os
import uuid
import json
from confluent_kafka import Producer
import redis


def extract_ra_dec(redis_client):
    try:
        res = random.randint(1, 9000)
        # Get the JSON data from Redis
        json_data = redis_client.get(f"harvard_ref_#:{res}")
        
        if json_data is None:
            print("Error: RA and DEC data not found in Redis")
            return None, None, None
        
        # Decode the JSON data and parse it as a dictionary
        data_dict = json.loads(json_data.decode('utf-8'))
        # Extract the RA and DEC values
        ra = data_dict.get("RA")
        dec = data_dict.get("DEC")
        title = data_dict.get("Title HD")
        
        if ra is None or dec is None:
            print("Error: RA or DEC value is missing in the data")
            return None,None , None
        return ra, dec, title
    except Exception as e:
        print(f"An error occurred while extracting RA and DEC: {e}")
        return None, None, None

def random_utc():
    # Get the current UTC datetime
    utc_now = datetime.datetime.now(pytz.utc)

    # Generate a random time delta within the last 30 days
    random_delta = datetime.timedelta(days=random.randint(0, 30), hours=random.randint(0, 23),
                                      minutes=random.randint(0, 59), seconds=random.randint(0, 59))

    # Subtract the random time delta from the current UTC datetime
    random_utc_datetime = utc_now - random_delta

    # Format the random UTC datetime as a string
    random_utc_datetime_str = random_utc_datetime.strftime("%Y-%m-%d %H:%M:%S %Z")

    return random_utc_datetime_str

def generate_random_event_source(sources_list):
    event = random.choice(sources_list)
    return event

def generate_random_event_type(types_list):
    event = random.choice(types_list)
    return event

def generate_urgent():
    res = random.randint(1, 5)
    return res


def generate_message(events_sources, events_types, producer, redis_client):
    message = {}
    message["UTC"] = random_utc()
    message["EventSource"] = generate_random_event_source(events_sources)
    ra_column, dec_column, title_column = extract_ra_dec(redis_client)

    message["RA"] = extract_ra_dec(redis_client)[0]
    message["DEC"] = extract_ra_dec(redis_client)[1]

    message["EventType"] = generate_random_event_type(events_types)
    message["Urgent"] = generate_urgent()
    message["Title"] = extract_ra_dec(redis_client)[2]

    print(message)
    return message

conf = {
    "group.id": "zadgcfjl-astro",
    "metadata.broker.list": "dory.srvs.cloudkafka.com:9094",
    "socket.keepalive.enable": True,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-512",
    "sasl.username": "zadgcfjl",
    "sasl.password": "8F5jtP461cb2DAz_JmDWmIG6hZqifw23",
    "debug": "generic,broker,security"
}
producer = Producer(conf)

def delivery_report(err, msg):
    if err is not None:
        print('Message delivery failed: {}'.format(err))
    else:
        print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))

def publish(msg):
    try:
        # Produce the message to the Kafka topic
        producer.produce(
            topic="zadgcfjl-astro",
            value=json.dumps(msg).encode('utf-8'),
            callback=delivery_report,
            key=str(uuid.uuid4())  # Optional: Provide a key for message partitioning
        )
        producer.flush()  # Wait for the message to be delivered
        print("Message published to Kafka")
    except Exception as e:
        print(f"An error occurred while publishing the message to Kafka: {e}")

events_sources = [
    "MMT", "Gemini Observatory Telescopes", "Very Large Telescope",
    "Southern African Large Telescope", "Hobby-Eberly Telescope",
    "Keck 1 and 2", "Gran Telescopio Canarias", "The Giant Magellan Telescope",
    "Thirty Meter Telescope", "European Extremely Large Telescope"
]
events_types = ["1", "2", "3","4","5"]

# Create a Redis client
redis_client = redis.Redis()
while True:
    message = generate_message(events_sources, events_types, producer, redis_client)
    publish(message)
