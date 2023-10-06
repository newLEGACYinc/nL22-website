from flask import Flask, request
from bs4 import BeautifulSoup
import requests
import time
import re
from pymongo import MongoClient
from bson import json_util
from celery import Celery
import os
from dotenv import load_dotenv
import sys


class recursionlimit:
    def __init__(self, limit):
        self.limit = limit

    def __enter__(self):
        self.old_limit = sys.getrecursionlimit()
        sys.setrecursionlimit(self.limit)

    def __exit__(self, type, value, tb):
        sys.setrecursionlimit(self.old_limit)


app = Flask(__name__)

load_dotenv()
login = os.environ.get("RMQ_LOGIN")
rmq_endpoint = os.environ.get("RMQ_ENDPOINT")
bot_token = os.environ.get("BOT_TOKEN")
cagematch_username = os.environ.get("CAGEMATCH_USERNAME")
cagematch_password = os.environ.get("CAGEMATCH_PASSWORD")

celery = Celery(
    __name__,
    broker=f"amqps://{login}@{rmq_endpoint}",
    backend=f"rpc://{login}@{rmq_endpoint}",
    ignore_result=False
)

client = MongoClient("localhost", 27017)
db = client["nL22"]

rate_limit = 0.25


def send_get_request(url):
    page = requests.get(url, headers={
                        'Accept-Encoding': '*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'})
    time.sleep(rate_limit)
    page.encoding = 'utf-8'
    return BeautifulSoup(page.content, "html5lib")


def send_post_request(url, payload):
    page = requests.post(url, headers={
        'Accept-Encoding': '*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'}, data=payload)
    time.sleep(rate_limit)
    page.encoding = 'utf-8'
    return BeautifulSoup(page.content, "html5lib")


def check_member(id):
    response = requests.get(f'https://discord.com/api/guilds/139833084722806784/members/{id}', headers={
        'Authorization': f'Bot {bot_token}'})
    time.sleep(rate_limit)
    return response.status_code


def get_matches(href, targetYear, type):
    if type == 'total':
        url = f"https://www.cagematch.net/2k16/printversion.php{href}&page=22"
    elif type == 'house':
        url = f"https://www.cagematch.net/2k16/printversion.php{href}&page=22&type=byYear&eventType=House+Show"
    soup = send_get_request(url)
    years = soup.select(
        'tr.TRow1 > td:nth-of-type(2), tr.TRow2 > td:nth-of-type(2)')
    total = 0
    for idx, year in enumerate(years):
        if year.text == str(targetYear) or year.text == str(targetYear + 1):
            total += int(soup.select(
                'tr.TRow1 > td:nth-of-type(3), tr.TRow2 > td:nth-of-type(3)')[idx].text)
        elif int(year.text) < (targetYear - 1):
            break
    return total


def get_wrestlers(soup, year):
    wrestlers = soup.select(
        'tr.TRow1 > td:nth-of-type(2), tr.TRow2 > td:nth-of-type(2)')
    for wrestler in wrestlers:
        url = wrestler.find(
            'a', href=True, text=True)['href']
        total = get_matches(url, year, 'total')
        if total >= 10:
            house = get_matches(url, year, 'house')
            if total - house >= 10:
                soup2 = send_get_request(
                    f"https://www.cagematch.net/2k16/printversion.php{url}")
                infoRows = soup2.select('div.InformationBoxRow')
                gimmicks = []
                for infoRow in infoRows:
                    if infoRow.select('div.InformationBoxTitle')[0].text == 'Alter egos:':
                        for gimmick in infoRow.select('div.InformationBoxContents > a'):
                            gimmicks.append(gimmick.text.strip())
                        break

                collection = db[f"{year}"]
                wrestlerData = {
                    "_id": int(re.findall(r'\?id=2&nr=(.+?)(?=\&|$)', url)[0]),
                    "name": wrestler.text.strip(),
                    "gimmicks": gimmicks
                }
                collection.update_one({"_id": wrestlerData['_id']}, {
                                      '$set': wrestlerData}, upsert=True)
                print(wrestlerData)


@app.route("/api/nL22/scrape/<year>")
def call_scrape(year):
    result = scrape.delay(
        'https://www.cagematch.net/2k16/printversion.php?id=2&view=workers', int(year), False)
    return {"result_id": result.id}


@celery.task
def scrape(url, year, login_status):
    with recursionlimit(10000):
        if login_status is False:
            payload = {'action': 'login', 'referrer': url,
                       'fUsername': cagematch_username, 'fPassword': cagematch_password, 'fCookieAgreement': 'yes'}
            login = "https://www.cagematch.net/?id=872"
            soup = send_post_request(login, payload)
        else:
            soup = send_get_request(url)
        get_wrestlers(soup, int(year))
        pages = soup.select('div.NavigationPartPage > a')
        for page in pages:
            if re.search("^>$", page.text):
                next_page = page['href']
                break
        try:
            if next_page is not None:
                scrape('https://www.cagematch.net/2k16/printversion.php' +
                       next_page, year, True)
        except UnboundLocalError:
            pass  # Last Page so do nothing


@app.route("/api/nL22/data/<year>")
def get_database(year):
    cursor = db[f"{year}"].find()
    return json_util.dumps(cursor)


@app.route("/api/nL22/tasks/<id>")
def result(id):
    result = celery.AsyncResult(id)
    ready = result.ready()
    return {
        "ready": ready,
        "successful": result.successful() if ready else None,
        "value": result.get() if ready else result.result,
    }


@app.route("/api/nL22/ballot/<year>/<userid>", methods=['GET'])
@app.route("/api/nL22/ballot/<year>", methods=['POST'], defaults={'userid': None})
def ballot_op(year, userid):
    if request.method == 'POST':
        collection = db[f"{year}-ballots"]
        collection.update_one({'_id': request.get_json()["_id"]}, {
            '$set': request.get_json()}, upsert=True)
        return "Ballot Received"
    elif request.method == 'GET':
        collection = db[f"{year}-ballots"].find_one({'_id': userid})
        if collection:
            return collection
        else:
            return {'_id': userid}


@app.route("/api/nL22/results/<year>")
def calculate_results(year):
    wrestlers = db[f"{year}"]
    results = db[f"{year}-results"]
    results.drop()
    valid = 0
    for ballot in db[f"{year}-ballots"].find():
        i = 1
        if check_member(ballot["_id"]) != 200:
            continue
        for attribute, value in reversed(ballot.items()):
            if attribute == '_id':
                continue
            wrestler = wrestlers.find_one({'_id': value})
            if attribute == '1':
                results.update_many({'_id': wrestler["_id"]}, {'$set': {'_id': wrestler["_id"], 'name': wrestler["name"]},
                                                               '$inc': {'points': i, 'first': 1}}, upsert=True)
            else:
                results.update_many({'_id': wrestler["_id"]}, {'$set': {'_id': wrestler["_id"], 'name': wrestler["name"]},
                                                               '$inc': {'points': i, 'first': 0}}, upsert=True)
            i += 1
        valid += 1
    ranking = sorted(results.find(), key=lambda x: (-x['points'], -x['first']))
    list = []
    for index, wrestler in enumerate(ranking):
        list.append(
            f'{index + 1}. {wrestler["name"]} ({wrestler["points"]} points) (1st Place: {wrestler["first"]})')
    return f'{json_util.dumps(list)}\nTotal valid ballots: {valid}'


if __name__ == "__main__":
    app.run(debug=True)
