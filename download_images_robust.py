import urllib.request
import os
import time

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

for cat, keywords in categories.items():
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.exists(cat_dir):
        os.makedirs(cat_dir)
    
    for i, keyword in enumerate(keywords):
        filepath = os.path.join(cat_dir, f"{i+1}.jpg")
        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            print(f"Skipping {filepath}")
            continue
            
        url = f"https://loremflickr.com/600/400/{keyword}"
        for attempt in range(3):
            try:
                print(f"Downloading {keyword} to {filepath}...")
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    with open(filepath, 'wb') as out_file:
                        out_file.write(response.read())
                time.sleep(1)
                break
            except Exception as e:
                print(f"Failed {keyword}: {e}")
                time.sleep(2)
