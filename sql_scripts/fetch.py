import requests
import mysql.connector
import json

#Note: Need to install mysql-client on machine

API_URL = "https://data.baltimorecity.gov/resource/wsfq-mvij.json"
LIMIT = 1000
API_TOKEN = None
DB_URL = "localhost"

FIELDS = ["crimedate", "crimetime", "crimecode", "location", "description", "inside_outside", "weapon", "post", "district", "neighborhood", "longitude", "latitude", "premise", "total_incidents"]


def data_to_query(entry):

    for field in FIELDS:
        if not entry.get(field,False):
            entry[field] = ""
    
    if entry["inside_outside"] and entry["inside_outside"].lower() == "outside":
        entry["inside_outside"] = "O"
    elif entry["inside_outside"] and entry["inside_outside"].lower() == "inside":
        entry["inside_outside"] = "I"

    return """
    INSERT INTO crime (crimedate, crimetime, crimecode, location, description, inside_outside, weapon, post, district, neighborhood, longitude, latitude, premise, total_incidents)
    VALUE ('{crimedate}', '{crimetime}', '{crimecode}',
    '{location}', '{description}', '{inside_outside}', '{weapon}', '{post}',
    '{district}', '{neighborhood}', '{longitude}', '{latitude}', '{premise}', 
    '{total_incidents}');
    """.format(**entry)

#Connect to MySQL Database
db = mysql.connector.connect(host=DB_URL, database="bpd_crime", user="alex", password="admin")
cursor = db.cursor()

response = requests.get(
        API_URL,
        params={"$limit": LIMIT,}
    )

print(response.content)

data = json.loads(response.content)
print(data)
for entry in data:
    print(data_to_query(entry))
    cursor.execute(data_to_query(entry))
    db.commit();


