import urllib.request
import json
import os

queries = ["pizza", "chicken", "paneer", "burger", "sandwich", "fries", "samosa", "biryani", "dosa", "cake", "ice cream", "noodles", "rice", "dal"]

os.makedirs("mealdb_images", exist_ok=True)

results = {}

for q in queries:
    url = f"https://www.themealdb.com/api/json/v1/1/search.php?s={q}"
    try:
        data = json.loads(urllib.request.urlopen(url).read().decode('utf-8'))
        if data['meals']:
            for m in data['meals']:
                results[m['strMeal']] = m['strMealThumb']
    except Exception as e:
        print(f"Error on {q}: {e}")

with open("mealdb_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"Found {len(results)} meals.")
