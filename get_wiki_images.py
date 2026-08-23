import urllib.request
import json
import os

FOOD_DIR = "frontend/src/assets/food/"
os.makedirs(os.path.dirname(os.path.join(FOOD_DIR, "south-indian/")), exist_ok=True)

wiki_images = {
    "south-indian/1.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_street_food_stall.jpg", # Dosa
    "south-indian/2.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG", # Idli
    "south-indian/3.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Medu_Vada.jpg/800px-Medu_Vada.jpg", # Vada
    "biryani/2.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Chicken_Biryani_in_Chennai.jpg", # Biryani
    "snacks/3.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Garlic_Bread.jpg/800px-Garlic_Bread.jpg", # Garlic Bread
    "biryani/3.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Vegetable_Biryani.jpg/800px-Vegetable_Biryani.jpg" # Veg Biryani
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)

for dest, url in wiki_images.items():
    dest_path = os.path.join(FOOD_DIR, dest)
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Downloaded {dest}")
    except Exception as e:
        print(f"Failed to download {dest}: {e}")

