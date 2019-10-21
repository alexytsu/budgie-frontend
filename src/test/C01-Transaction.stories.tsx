import * as React from "react";

import Transaction from "../ui/components/transaction/Transaction";
import {
	TransactionDisplayProps,
	TransactionType
} from "../util/types/TransactionTypes";

export default { title: "Transactions" };

const exampleTranscation: TransactionDisplayProps = {
	account: "Chequing",
	amount: 20.12,
	category: "Eating Out",
	date: new Date(),
	description: "Family Dinner",
	type: TransactionType.EXPENSE
};

export const simpleTransaction = () => (
	<Transaction {...exampleTranscation}></Transaction>
);

const exampleIncome: TransactionDisplayProps = {
	account: "Chequing",
	amount: 1120.77,
	category: "Salary",
	date: new Date(),
	description: "October Pay",
	type: TransactionType.INCOME
};

export const simpleIncome = () => (
	<Transaction {...exampleIncome}></Transaction>
);
