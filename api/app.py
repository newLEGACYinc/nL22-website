from flask import Flask, jsonify, abort
from pymongo import MongoClient
import tweepy
from bs4 import BeautifulSoup
import requests
import re
import random
from datetime import datetime
from deep_translator import GoogleTranslator
import configparser

Config = configparser.ConfigParser()
Config.read("api.ini")
app = Flask(__name__)

dbClient = MongoClient()
hol = dbClient.hol
kayfable = dbClient.kayfable
general = dbClient.general

hol_wrestler = hol.wrestler
hol_promotion = hol.promotion

kayfable_wrestler = kayfable.wrestler
kayfable_gimmicks = kayfable.gimmicks

blacklist_wrestler = general.blacklist_wrestler
whitelist_wrestler = general.whitelist_wrestler

blacklist_promotion = general.blacklist_promotion
whitelist_promotion = general.whitelist_promotion

db = dbClient.accounts
wrestler = db.wrestler
promotion = db.promotion
w_blacklist = db.wblacklist
p_blacklist = db.pblacklist
kwrestler = db.kwrestler
kgimmick = db.kgimmick
answer = db.answer


twtClient = tweepy.Client(
    Config.get('SECRET', 'Twitter'))


def holscrape():
    print("Higher or Lower Scrape starting")
    wrestlerlimit = 25311
    promotionlimit = 3336
    string = ""
    for id in range(1, wrestlerlimit + 1):
        if w_blacklist.count_documents({"id": int(id)}, limit=1) == 0:
            if wrestler.count_documents({"id": int(id)}, limit=1) == 0:
                try:
                    url = f"https://www.cagematch.net/2k16/printversion.php?id=2&nr={id}"
                    page = requests.get(
                        url, headers={'Accept-Encoding': 'identity'})
                    soup = BeautifulSoup(page.content, 'html.parser')
                    name = soup.find_all(class_="NavigationTreeBranch")[
                        2].get_text()
                    data = soup.find_all(href=re.compile("twitter"))
                    username = re.split("(twitter.com\/#!\/|twitter.com\/)",
                                        data.get_text())[2].split("/")[0].split("?")[0]
                    result = {
                        "id": int(id),
                        "name": name.strip(),
                        "username": username.strip(),
                        "followers": 0,
                        "profile_image": "",
                    }
                    wrestler.replace_one({"id": int(id)}, result, upsert=True)
                    string += f"</br>{name} - @{username} Added"
                except Exception:
                    continue
        print(
            f"Wrestler Scraping Progress: {id}/{wrestlerlimit}", end="\r")

    for id in range(1, promotionlimit + 1):
        if p_blacklist.count_documents({"id": int(id)}, limit=1) == 0:
            if promotion.count_documents({"id": int(id)}, limit=1) == 0:
                try:
                    url = f"https://www.cagematch.net/2k16/printversion.php?id=8&nr={id}"
                    page = requests.get(
                        url, headers={'Accept-Encoding': 'identity'})
                    soup = BeautifulSoup(page.content, 'html.parser')
                    name = soup.find_all(class_="NavigationTreeBranch")[
                        2].get_text()
                    data = soup.find("a", href=re.compile("twitter"))
                    username = re.split("(twitter.com\/#!\/|twitter.com\/)",
                                        data.get_text())[2].split("/")[0].split("?")[0]
                    result = {
                        "id": int(id),
                        "name": name.strip().split('(')[0],
                        "username": username.strip(),
                        "followers": 0,
                        "profile_image": "",
                    }
                    promotion.replace_one({"id": int(id)}, result, upsert=True)
                    string += f"</br>{name} - @{username} Added"
                except Exception as e:
                    continue
        print(
            f"Promotion Scraping Progress: {id}/{promotionlimit}", end="\r")

    return string


def twitterdata(record, collection, type):
    while True:
        try:
            response = twtClient.get_user(username=record["username"], user_fields=[
                "public_metrics", "profile_image_url"])
            result = {
                "id": int(record["id"]),
                "name": record["name"],
                "username": f"@{response.data.username}",
                "followers": response.data.public_metrics["followers_count"],
                "profile_image": f"{response.data.profile_image_url.split('_normal')[0]}_400x400{response.data.profile_image_url.split('_normal')[1]}",
            }
            collection.replace_one(
                {"id": int(record["id"])}, result, upsert=True)
            if response.data.public_metrics["followers_count"] > 500:
                return result
            else:
                record = list(collection.aggregate(
                    [{"$sample": {"size": 1}}]))[0]
        except tweepy.errors.TooManyRequests:
            return databasedata(type)
        except Exception as e:
            record = list(collection.aggregate([{"$sample": {"size": 1}}]))[0]
            continue


def databasedata(type=None, id=None):
    if type == None:
        type = random.choice(["promotion", "wrestler"])
    if type == "promotion":
        if id == None:
            result = list(promotion.aggregate([
                {"$match": {"followers": {"$gt": 500}}}, {"$sample": {"size": 1}}]))[0]

        else:
            result = promotion.find_one({"id": int(id)})
    elif type == "wrestler":
        if id == None:
            result = list(wrestler.aggregate([
                {"$match": {"followers": {"$gt": 500}}}, {"$sample": {"size": 1}}]))[0]
        else:
            result = wrestler.find_one({"id": int(id)})
    return {
        "id": int(result["id"]),
        "name": result["name"],
        "username": result["username"],
        "followers": result["followers"],
        "profile_image": result["profile_image"]
    }


@app.route("/api/higherorlower/database")
@app.route("/api/higherorlower/database/<type>")
@app.route("/api/higherorlower/database/<type>/<id>")
def load_database_data(type=None, id=None):
    return databasedata(type, id)


@app.route("/api/higherorlower/data")
@app.route("/api/higherorlower/data/<type>")
@app.route("/api/higherorlower/data/<type>/<id>")
def load_data(type=None, id=None):
    if type == None:
        type = random.choice(["promotion", "wrestler"])
    if type == "wrestler":
        if id == None:
            record = list(wrestler.aggregate([{"$sample": {"size": 1}}]))[0]
        else:
            record = wrestler.find_one({"id": int(id)})
        return twitterdata(record, wrestler, type)
    elif type == "promotion":
        if id == None:
            record = list(promotion.aggregate([{"$sample": {"size": 1}}]))[0]
        else:
            record = promotion.find_one({"id": int(id)})
        return twitterdata(record, promotion, type)


@app.route("/api/higherorlower/blacklist/<type>/<id>")
def blacklist_data(type, id):
    if type == "wrestler":
        name = wrestler.find_one({"id": int(id)})["name"]
        wrestler.delete_one({"id": int(id)})
        w_blacklist.replace_one(
            {"id": int(id)}, {"id": int(id), "name": name}, upsert=True)
        return f"<a href=https://www.cagematch.net/?id=2&nr={id}>{name}</a> Blacklisted"
    elif type == "promotion":
        name = promotion.find_one({"id": int(id)})["name"]
        promotion.delete_one({"id": int(id)})
        p_blacklist.replace_one(
            {"id": int(id)}, {"id": int(id), "name": name}, upsert=True)
        return f"<a href=https://www.cagematch.net/?id=8&nr={id}>{name}</a> Blacklisted"


@app.route("/api/higherorlower/whitelist/<type>/<id>")
def whitelist_data(type, id):
    if type == "wrestler":
        name = w_blacklist.find_one({"id": int(id)})["name"]
        w_blacklist.delete_one({"id": int(id)})
        return f"<a href=https://www.cagematch.net/?id=2&nr={id}>{name}</a> Whitelisted"
    elif type == "promotion":
        name = p_blacklist.find_one({"id": int(id)})["name"]
        p_blacklist.delete_one({"id": int(id)})
        return f"<a href=https://www.cagematch.net/?id=8&nr={id}>{name}</a> Whitelisted"


@app.route("/api/higherorlower/scrape")
def scrape_hol_date():
    string = holscrape()
    return "Higher or Lower Scrape Complete" + string


@app.route("/api/higherorlower/check/<type>")
def check_hol(type):
    string = []
    if type == "wrestler":
        for x in wrestler.find({}):
            record = {
                "id": x["id"],
                "name": x["name"],
                "username": x["username"],
                "followers": x["followers"],
                "profile_image": x["profile_image"]
            }
            string.append(record)
    elif type == "promotion":
        for x in promotion.find({}):
            record = {
                "id": x["id"],
                "name": x["name"],
                "username": x["username"],
                "followers": x["followers"],
                "profile_image": x["profile_image"]
            }
            string.append(record)
    elif type == "w_blacklist":
        for x in w_blacklist.find({}):
            record = {
                "id": x["id"],
                "name": x["name"]
            }
            string.append(record)
    elif type == "p_blacklist":
        for x in p_blacklist.find({}):
            record = {
                "id": x["id"],
                "name": x["name"]
            }
            string.append(record)
    return jsonify(string)


def kgimmick_scrape():
    string = "ID - Name</br>"
    print("Kayfable Gimmick Scrape Starting")
    pagelimit = 111
    for id in range(0, (pagelimit + 1) * 100, 100):
        print(
            f"Page Scraping Progress: {int((id/100))}/{pagelimit}", end="\r")
        url = f"https://www.cagematch.net/?id=2&view=gimmicks&sortby=colVotes&sorttype=DESC&s={id}"
        page = requests.get(
            url, headers={'Accept-Encoding': 'identity'})
        soup = BeautifulSoup(page.content, 'html.parser')
        tab = soup.find("table", class_="TBase TableBorderColor")
        rows = tab.findChildren('tr', class_=re.compile('TRow*'))
        for row in rows:
            try:
                cells = row.findChildren(
                    'td', class_="TCol TColSeparator")
                link = cells[1].find('a').get('href').split("&name")[0]
                wrestler_id = link.split("&nr=")[1]
                url = f"https://www.cagematch.net/2k16/printversion.php?id=2&nr={wrestler_id}"
                page = requests.get(
                    url, headers={'Accept-Encoding': 'identity'})
                soup = BeautifulSoup(page.content, 'html.parser')
                name = soup.find_all(class_="NavigationTreeBranch")[
                    2].get_text()
                if w_blacklist.count_documents({"id": int(wrestler_id)}, limit=1) == 0:
                    if kwrestler.count_documents({"id": int(wrestler_id)}, limit=1):
                        string += f'{wrestler_id} - {cells[1].string.strip()}</br>'
                        result = {
                            "id": int(wrestler_id),
                            "gimmick": cells[1].string.strip(),
                            "name": name.strip()
                        }
                        kgimmick.replace_one(result, result, upsert=True)
            except Exception as e:
                print(e)
                continue
    return("Kayfable Scrape Complete</br>" + string)


def k_scrape():
    string = "ID - Name - Birth Date - Birthplace - Debut Year - Height - Weight</br>"
    translator = GoogleTranslator(source="de", target="en")
    print("Kayfable Scrape Starting")
    pagelimit = 33
    for id in range(0, (pagelimit + 1) * 100, 100):
        print(f"Page Scraping Progress: {int(id/100)}/{pagelimit}", end="\r")
        url = f"https://www.cagematch.net/2k16/printversion.php?id=2&view=workers&minVotes=5&s={id}"
        page = requests.get(
            url, headers={'Accept-Encoding': 'identity'})
        soup = BeautifulSoup(page.content, 'html.parser')
        tab = soup.find("table", class_="TBase TableBorderColor")
        rows = tab.findChildren('tr', class_=re.compile('TRow*'))
        for row in rows:
            try:
                cells = row.findChildren(
                    'td', class_=["TCol TColSeparator", "TCol TColSeparator AlignRight"])
                link = cells[1].find('a').get('href').split("&gimmick")[0]
                url = f"https://www.cagematch.net/{link}"
                page = requests.get(
                    url, headers={'Accept-Encoding': 'identity'})
                soup = BeautifulSoup(page.content, 'html.parser')
                wrestler_id = link.split("&nr=")[1]
                if w_blacklist.count_documents({"id": int(wrestler_id)}, limit=1) == 0:
                    try:
                        debut = soup.find(
                            "div", text="Beginning of in-ring career:").findNext('div').contents[0].split('.')
                        if len(debut[len(debut) - 1]) < 4:
                            debut = "N/A"
                        else:
                            debut = debut[len(debut) - 1]
                    except:
                        debut = "N/A"
                    gender = soup.find(
                        "div", text="Gender:").findNext('div').contents[0].capitalize()
                    birth_place = cells[3].string.split(", ")
                    birth_place = translator.translate(
                        birth_place[len(birth_place) - 1])
                    if cells[2].string is not None:
                        birth_date = cells[2].string.split('.')
                        if len(birth_date[len(birth_date) - 1]) < 4:
                            birth_date = "N/A"
                        else:
                            birth_date = cells[2].string
                    else:
                        birth_date = "N/A"
                    if cells[4].string is not None:
                        height = int(float(cells[4].string))
                    else:
                        height = "N/A"
                    if cells[5].string is not None:
                        weight = int(float(cells[5].string))
                    else:
                        weight = "N/A"
                    string += f'{wrestler_id} - {cells[1].string.strip()} - {birth_date} - {birth_place} - {debut} - {height} - {weight}</br>'
                    result = {
                        "id": int(wrestler_id),
                        "name": cells[1].string.strip(),
                        "gender": gender,
                        "birth_date": birth_date.strip(),
                        "birth_place": birth_place,
                        "debut_year": debut,
                        "height": height,
                        "weight": weight,
                    }
                    kwrestler.replace_one(
                        {"id": int(wrestler_id)}, result, upsert=True)
            except:
                continue
    return("Kayfable Scrape Complete</br>" + string)


@app.route("/api/kayfable/scrape")
def kayfable_scrape():
    k_string = k_scrape()
    kg_string = kgimmick_scrape()
    return(k_string + "</br>" + kg_string)


@app.route("/api/kayfable/database")
@app.route("/api/kayfable/database/<id>")
def load_kayfable_database(id):
    result = kwrestler.find_one({"id": int(id)})
    return {
        "id": result["id"],
        "name": result["name"],
        "gender": result["gender"],
        "birth_date": result["birth_date"],
        "birth_place": result["birth_place"],
        "debut_year": result["debut_year"],
        "height": result["height"],
        "weight": result["weight"]
    }


@app.route("/api/kayfable/valid")
def load_kayfable_valid():
    string = []
    records = list(kwrestler.aggregate([
        {"$match": {"$and": [{"birth_date": {"$ne": "N/A"}}, {"debut_year": {"$ne": "N/A"}}, {"height": {"$ne": "N/A"}}, {"weight": {"$ne": "N/A"}}]}}]))
    for record in records:
        result = {
            "id": record["id"],
            "name": record["name"],
            "birth_date": record["birth_date"],
            "debut_year": record["debut_year"],
            "height": record["height"],
            "weight": record["weight"]
        }
        string.append(result)
    return jsonify(string)


@app.route("/api/kayfable/answer")
def load_kayfable_answer():
    date = datetime.now()
    id = date.strftime("%Y%m%d")
    if answer.count_documents({"game_id": id}, limit=1) == 0:
        while True: 
            record = list(kwrestler.aggregate([
                {"$match": {"$and": [{"birth_date": {"$ne": "N/A"}}, {"debut_year": {"$ne": "N/A"}}, {"height": {"$ne": "N/A"}}, {"weight": {"$ne": "N/A"}}]}}, {"$sample": {"size": 1}}]))[0]
            if answer.count_documents({"id": record["id"]}, limit=1) == 0:
                answer.replace_one(
                    {"game_id": id}, {"game_id": id, "id": record["id"]}, upsert=True)
                break
            else:
                continue
    else:
        answer_record = answer.find_one({"game_id": id})
        record = kwrestler.find_one({"id": answer_record["id"]})
    result = {
        "game_id": id,
        "id": record["id"],
        "name": record["name"],
        "gender": record["gender"],
        "birth_year": parse_birthyear(record["birth_date"]),
        "birth_place": record["birth_place"],
        "debut_year": record["debut_year"],
        "height": record["height"],
        "weight": record["weight"]
    }
    return result


@app.route("/api/kayfable/data")
def load_kayfable_data():
    string = {
        "wrestlers": check_kayfable("database"),
        "gimmicks": check_kayfable("gimmick"),
        "answer": load_kayfable_answer()
    }
    return jsonify(string)


def calculate_age(birth_date):
    today = datetime.today()
    try:
        if birth_date == "N/A":
            return "N/A"
        birth_date = birth_date.split('.')
        if len(birth_date) == 3:
            if len(birth_date[2]) < 4:
                return "N/A"
            else:
                year = birth_date[2]
                month = birth_date[1]
                day = birth_date[0]
        elif len(birth_date) == 2:
            year = birth_date[1]
            month = birth_date[0]
            day = 1
        elif len(birth_date) == 1:
            year = birth_date[0]
            return today.year - int(year)
        else:
            return "N/A"
        return today.year - int(year) - ((today.month, today.day) < (int(month), int(day)))
    except Exception:
        return "N/A"

def parse_birthyear(birth_date):
    try:
        if birth_date == "N/A":
            return "N/A"
        birth_date = birth_date.split('.')
        if len(birth_date) == 3:
            if len(birth_date[2]) < 4:
                return "N/A"
            else:
                year = birth_date[2]
        elif len(birth_date) == 2:
            year = birth_date[1]
        elif len(birth_date) == 1:
            year = birth_date[0]
        else:
            return "N/A"
        return year
    except Exception:
        return "N/A"



@app.route("/api/kayfable/guess/<id>")
def load_guess(id):
    result = kwrestler.find_one({"id": int(id)})
    return {
        "id": result["id"],
        "name": result["name"],
        "gender": result["gender"],
        "birth_year": result["birth_date"],
        "birth_place": result["birth_place"].strip(),
        "debut_year": result["debut_year"],
        "height": result["height"],
        "weight": result["weight"]
    }

def check_kayfable(type):
    string = []
    if type == "database":
        for x in kwrestler.find({}):
            record = {
                "id": x["id"],
                "name": x["name"],
                "gender": x["gender"],
                "birth_year": parse_birthyear(x["birth_date"]),
                "birth_place": x["birth_place"],
                "debut_year": x["debut_year"],
                "height": x["height"],
                "weight": x["weight"]
            }
            string.append(record)
    if type == "answer":
        for x in answer.find({}):
            record = {
                "game_id": x["game_id"],
                "id": x["id"]
            }
            string.append(record)
    if type == "gimmick":
        for x in kgimmick.find({}):
            record = {
                "id": x["id"],
                "name": x["name"].strip(),
                "gimmick": x["gimmick"].strip()
            }
            string.append(record)
    return string


if __name__ == "__main__":
    app.run(debug=True)
