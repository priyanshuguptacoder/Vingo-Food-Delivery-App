import urllib.request
import json
import os

FOOD_DIR = "frontend/src/assets/food/"
opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
urllib.request.install_opener(opener)

def download_wiki_image(title, dest):
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=1000"
    try:
        response = urllib.request.urlopen(api_url).read().decode('utf-8')
        data = json.loads(response)
        pages = data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                img_url = pages[page_id]['thumbnail']['source']
                dest_path = os.path.join(FOOD_DIR, dest)
                urllib.request.urlretrieve(img_url, dest_path)
                print(f"Downloaded {dest} from {img_url}")
                return
        print(f"No image found for {title}")
    except Exception as e:
        print(f"Failed {title}: {e}")

download_wiki_image("Dosa", "south-indian/1.jpg")
download_wiki_image("Idli", "south-indian/2.jpg")
download_wiki_image("Vada_(food)", "south-indian/3.jpg")
download_wiki_image("Garlic_bread", "snacks/3.jpg")
download_wiki_image("Hyderabadi_biryani", "biryani/2.jpg")
download_wiki_image("Samosa", "snacks/4.jpg")
