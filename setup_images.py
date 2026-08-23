import os
import shutil
import urllib.request

ARTIFACT_DIR = "/Users/priyanshugupta/.gemini/antigravity/brain/12a917c3-e0f3-437f-90f6-af68bc5fea91/"
FOOD_DIR = "frontend/src/assets/food/"

# Mapping the generated images to their category destinations
generated_map = {
    "pizza_margherita": "pizza/1.jpg",
    "pizza_paneer_tikka": "pizza/2.jpg",
    "pizza_farmhouse": "pizza/3.jpg",
    "pizza_chicken_pepperoni": "pizza/4.jpg",
    "indian_butter_chicken": "north-indian/1.jpg",
    "indian_paneer_butter_masala": "north-indian/2.jpg",
    "indian_dal_makhani": "north-indian/3.jpg",
    "indian_thali": "north-indian/4.jpg",
    "burger_classic": "burgers/1.jpg",
    "burger_chicken": "burgers/2.jpg",
    "sandwich_club": "sandwiches/1.jpg",
    "sandwich_veg": "sandwiches/2.jpg",
    "snack_samosa": "snacks/1.jpg",
}

for root, _, files in os.walk(ARTIFACT_DIR):
    for file in files:
        if not file.endswith(".jpg"): continue
        for key, dest in generated_map.items():
            if file.startswith(key):
                dest_path = os.path.join(FOOD_DIR, dest)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copy2(os.path.join(root, file), dest_path)
                print(f"Copied {file} to {dest}")

# Downloading additional meals from TheMealDB
mealdb_downloads = {
    "https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg": "desserts/1.jpg", # Brownie
    "https://www.themealdb.com/images/media/meals/c0gmo31766594751.jpg": "desserts/2.jpg", # Apple Cake
    "https://www.themealdb.com/images/media/meals/swttys1511385853.jpg": "desserts/3.jpg", # Cheesecake
    "https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg": "biryani/1.jpg", # Lamb Biryani
    "https://www.themealdb.com/images/media/meals/xqrwyr1511133646.jpg": "desserts/4.jpg", # Salted Caramel Cheesecake
    "https://www.themealdb.com/images/media/meals/wuyd2h1765655837.jpg": "chinese/1.jpg", # Chicken Fried Rice
    "https://www.themealdb.com/images/media/meals/rvypwy1503069308.jpg": "chinese/2.jpg", # Laksa Noodles
    "https://www.themealdb.com/images/media/meals/sfahy01763752319.jpg": "chinese/3.jpg", # Rice Paper Dumplings (Momos alternative)
    "https://www.themealdb.com/images/media/meals/j223gc1784579841.jpg": "snacks/2.jpg", # Yuca Fries (Fries)
    "https://www.themealdb.com/images/media/meals/vdwloy1713225718.jpg": "burgers/3.jpg", # Halloumi Burger
    "https://www.themealdb.com/images/media/meals/djdg8l1784578885.jpg": "sandwiches/3.jpg", # Cuban Sandwich
    "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg": "north-indian/5.jpg", # Dal Fry
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)

for url, dest in mealdb_downloads.items():
    dest_path = os.path.join(FOOD_DIR, dest)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    try:
        urllib.request.urlretrieve(url, dest_path)
        print(f"Downloaded {dest}")
    except Exception as e:
        print(f"Failed to download {dest}: {e}")

