import urllib.request
url = "https://www.pexels.com/search/pizza/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print(html[:100])
except Exception as e:
    print(e)
