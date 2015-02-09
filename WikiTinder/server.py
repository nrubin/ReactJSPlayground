from flask import Flask, Response, request, jsonify
import requests
import os
import json

readability_key = "c439f2ebaf65caf56aad16d906d5da4a5ce21023"
readability_root_url = "http://readability.com/api/content/v1/parser"

app = Flask(__name__, static_url_path='', static_folder='.')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

MIN_CACHE_SIZE = 0
MAX_CACHE_SIZE = 10
article_cache = []



def fetch_article():
	print "fetching article, cache size = ", len(article_cache)
	raw_article = requests.get("http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json").json()["query"]
	random_article = {}
	random_article["url"] = "http://en.wikipedia.org/?curid=" + raw_article["pages"].keys()[0]
	random_article["title"] = raw_article["pages"][raw_article["pages"].keys()[0]]["title"]
	random_article["content"] = requests.get("%s?url=%s&token=%s" % (readability_root_url,random_article["url"],readability_key)).json()["content"]
	article_cache.append(random_article)


@app.route('/article')
def get_article():
	if len(article_cache) > MIN_CACHE_SIZE:
		return json.dumps(article_cache.pop())
	else:
		for _ in xrange(MAX_CACHE_SIZE - len(article_cache)):
			fetch_article()
		return json.dumps(article_cache.pop())

@app.route('/vote', methods=['POST'])
def log_vote():
	downvoted = request.form['downvoted']
	upvoted = request.form['upvoted']
	print downvoted, upvoted
	return jsonify({})

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        app.logger.debug("%s"%e)