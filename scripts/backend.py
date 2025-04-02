import sys
import json
import time
import os
import requests
import json

from dotenv import load_dotenv

load_dotenv()

WORLD_NEWS_API_KEY = os.getenv("WORLD_NEWS_API_KEY")

def getWorldNews(endpoint: str) :
	link = f"https://api.worldnewsapi.com/{endpoint}"

	r = requests.get(
		link,
		headers={
			"x-api-key": WORLD_NEWS_API_KEY
		}
	)

	if not r.ok :
		return {
			"success": False,
			"code": r.status_code,
			"reason": r.reason
		}

	got = json.loads(r.text)
	got["success"] = True

	return got

def getNews(articles_num: int = 100) :
	news = []

	left = articles_num
	offset = 0

	while left > 0 :
		info = getWorldNews(f"search-news?sort=publish-time&language=en&number={min(100, left)}&offset={offset}")

		if not info["success"] :
			return info

		if not "news" in info :
			return []

		news.extend(info["news"])

		left -= info["number"]
		offset += info["number"]

	return news

cmdict = {}

#Decorator to automatically rgister
#functions as callable with the cli
def addEntry(func) :
	cmdict[func.__name__] = func
	return func

@addEntry
def news() -> dict :
	currentday = int(time.time() / 60 / 60 / 24)

	try :
		with open(f"cache/{currentday}.json") as f :
			return {
				"cached": True,
				"news": json.load(f)
			}
	except :
		news = getNews(1000)

		if type(news) is dict :
			return news

		with open(f"cache/{currentday}.json", "w") as f :
			json.dump(news, f)

		return {
			"cached": False,
			"news": news
		}

if __name__ == "__main__" :
	d: dict = cmdict[sys.argv[1]](*sys.argv[2:])

	print(json.dumps(d))
