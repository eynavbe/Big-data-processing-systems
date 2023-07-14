import requests

# This code is only for sanity check to see that the data saved in eastic service.

index_name = 'astro'  # Replace with your index name
url = 'http://localhost:9200'

# Construct the request URL to retrieve all documents from the index
request_url = f'{url}/{index_name}/_search'

# Define the request payload to fetch all documents
payload = {
    "query": {
        "match_all": {}
    },
    "size": 1000  # Increase the size to retrieve more documents if necessary
}

# Send the POST request with the payload
response = requests.post(request_url, json=payload)

# Check the response status
if response.status_code == 200:
    # Retrieve the JSON response
    json_response = response.json()

    # Access the retrieved documents
    hits = json_response['hits']['hits']
    for hit in hits:
        # Access the document fields
        document = hit['_source']
        print(document)
else:
    print(f'Failed to retrieve documents. Status code: {response.status_code}')
