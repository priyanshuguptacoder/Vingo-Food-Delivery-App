import urllib.request
import os

categories = {
    "pizza": ["pizza,margherita", "pizza,cheese", "pizza,pepperoni"],
    "burgers": ["burger,beef", "burger,chicken", "burger,cheese"],
    "sandwiches": ["sandwich,club", "sandwich,grilled", "sandwich,sub"],
    "biryani": ["biryani,chicken", "biryani,mutton", "biryani,veg"],
    "north-indian": ["paneer,tikka", "butter,chicken", "naan,curry"],
    "chinese": ["noodles,chinese", "momos,dumplings", "fried,rice"],
    "snacks": ["samosa,snack", "french,fries", "garlic,bread"],
    "desserts": ["brownie,chocolate", "cake,slice", "icecream,scoop"],
    "south-indian": ["dosa,food", "idli,food", "vada,food"]
}

base_dir = "frontend/src/assets/food"

if not os.path.exists(base_dir):
    os.makedirs(base_dir)

import time

for cat, keywords in categories.items():
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.exists(cat_dir):
        os.makedirs(cat_dir)
    
    for i, keyword in enumerate(keywords):
        url = f"https://loremflickr.com/600/400/{keyword}"
        filepath = os.path.join(cat_dir, f"{i+1}.jpg")
        try:
            print(f"Downloading {keyword} to {filepath}...")
            urllib.request.urlretrieve(url, filepath)
            time.sleep(1)
        except Exception as e:
            print(f"Failed to download {keyword}: {e}")

