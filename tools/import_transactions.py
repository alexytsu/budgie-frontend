import requests
import pandas as pd

df = pd.read_csv('ledger.csv')

# URL = 'http://localhost:8000'
URL = 'http://cs4920.herokuapp.com'
USERNAME = 'userdemo'
PASSWORD = 'password'

register = requests.post(URL + '/users/', data={"username": USERNAME, "password": PASSWORD, "email": f"{USERNAME}@email.com"})
print(register.json())

login_resp = requests.post(URL + "/login/", data={"username": USERNAME, "password": PASSWORD})
login_resp = login_resp.json()
print(login_resp)
TOKEN = login_resp["token"]
HEADER = {"Authorization": "Token " + TOKEN}

categories = df['Category'].unique()
cat_id_lookup = {}

for cat in categories:
	type = "OUT"
	if cat == 'Income':
		type = "IN"
	cat_resp = requests.post(URL + "/categories/", data={"name": cat, "operation": type}, headers=HEADER)
	cat_resp = cat_resp.json()
	cat_id_lookup[cat] = cat_resp["id"]
	print(cat_resp)

print(cat_id_lookup)

for i, row in df.iterrows():
	category = row["Category"]
	print(category)
	if category == "(Transfer)":
		continue
	# cat_id = 0
	cat_id = cat_id_lookup[category]
	amount = row["Amount"]
	if category == "Income":
		amount *= -1
	
	date = row["Date"].split(" ")[0]


	transaction = {"amount": amount, "category": cat_id, "date": date}
	tr_resp = requests.post(URL + "/transactions/", data=transaction, headers=HEADER)
	print(tr_resp.json())