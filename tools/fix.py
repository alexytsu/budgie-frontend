import pandas as pd

df = pd.read_csv('ledger.csv')


def fix_dates(row):

	date = row["Date"]

	date = date.split(" ")[0]
	date_parts = date.split("/")
	new_date = date_parts[2] + "-" + date_parts[1] + "-" + date_parts[0]
	row["Date"] = new_date
	return row

new_df = df.apply(fix_dates, axis=1)
new_df.to_csv("ledger1.csv")

print(new_df)