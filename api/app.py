from flask import Flask, request
from bs4 import BeautifulSoup
import requests
import time
import re
from pymongo import MongoClient
from bson import json_util
import json

app = Flask(__name__)
client = MongoClient("localhost", 27017)
db = client["spritepw-test"]

rate_limit = 0.25
logged_in = False


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
        if year.text == str(targetYear) or year.text == str(targetYear - 1):
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

                collection = db["nL22-2023-test"]
                wrestlerData = {
                    "_id": int(re.findall(r'\?id=2&nr=(.+?)(?=\&|$)', url)[0]),
                    "name": wrestler.text.strip(),
                    "gimmicks": gimmicks
                }
                collection.update_one({"id": wrestlerData['_id']}, {
                                      '$set': wrestlerData}, upsert=True)
                print(wrestlerData)


@app.route("/api/eoty/scrape")
def scrape(url, year, login_status):
    if login_status is False:
        payload = {'action': 'login', 'referrer': url,
                   'fUsername': 'Spriter', 'fPassword': 'xeq3A3Mnzq', 'fCookieAgreement': 'yes'}
        login = "https://www.cagematch.net/?id=872"
        soup = send_post_request(login, payload)
        login_status = setLoginStatus(True)
    else:
        soup = send_get_request(url)
    get_wrestlers(soup, year)
    pages = soup.select('div.NavigationPartPage > a')
    for page in pages:
        if re.search("^>$", page.text):
            next_page = page['href']
            break
    if next_page is not None:
        scrape('https://www.cagematch.net/2k16/printversion.php' +
               next_page, year, login_status)


@app.route("/api/nL22/data/<year>")
def get_database(year):
    cursor = db[f"nL22-{year}-test"].find()
    return json_util.dumps(cursor)


@app.route("/api/nL22/ballot/<year>/<userid>", methods=['GET'])
@app.route("/api/nL22/ballot/<year>", methods=['POST'], defaults={'userid': None})
def ballot_op(year, userid):
    if request.method == 'POST':
        collection = db[f"nL22-{year}-ballots-test"]
        collection.update_one({'_id': request.get_json()["_id"]}, {
                            '$set': request.get_json()}, upsert=True)
        return "Ballot Received"
    elif request.method == 'GET':
        collection = db[f"nL22-{year}-ballots-test"].find_one({'_id': userid})
        if collection:
            return collection
        else:
            return {'_id': userid}


@app.route("/api/nL22/results/<year>")
def calculate_results(year):
    wrestlers = db[f"nL22-{year}-test"]
    results = db[f"nL22-{year}-results"]
    results.drop()
    for ballot in db[f"nL22-{year}-ballots-test"].find():
        i = 1
        for attribute, value in reversed(ballot.items()):
            if attribute == '_id':
                continue
            wrestler = wrestlers.find_one({'_id': value})
            results.update_many({'_id': wrestler["_id"]}, {'$set': {'_id': wrestler["_id"], 'name': wrestler["name"]},
                                                           '$inc': {'points': i}}, upsert=True)
            i += 1
    ranking = results.find().sort('points', -1)
    list = []
    for index, wrestler in enumerate(ranking):
        list.append(f'{index + 1}. {wrestler["name"]} ({wrestler["points"]} points)')
    return json_util.dumps(list)




def getLoginStatus():
    return logged_in


def setLoginStatus(status):
    logged_in = status
    return logged_in


# calculate_results(2023)
# scrape('https://www.cagematch.net/2k16/printversion.php?id=2&view=workers', 2024, logged_in)


if __name__ == "__main__":
    app.run(debug=True)
