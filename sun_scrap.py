import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

URL = "https://theskylive.com/sun-info"
page = requests.get(URL)
soup = BeautifulSoup(page.content, "html.parser")
table = soup.find("div", class_="sun_container")
image_url = table.find("img")["src"]
absolute_image_url = urljoin(URL, image_url)
response = requests.get(absolute_image_url)
with open("public/images/sunspots.jpg", "wb") as f:
    f.write(response.content)

print("Image saved as sunspots.jpg")
