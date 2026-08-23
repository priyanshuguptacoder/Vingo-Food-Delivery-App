import urllib.request
import json
import re

url = "https://unsplash.com/s/photos/margherita-pizza"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        print("Found JSON!")
    else:
        print("No JSON found")
except Exception as e:
    print(e)
