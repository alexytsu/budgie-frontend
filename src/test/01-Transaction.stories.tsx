import * as React from "react";
import Transaction from "../ui/components/transaction/Transaction";
import { TransactionDisplayProps, TransactionType } from "../util/types/TransactionTypes";

export default { title: "Transactions" };

const exampleTranscation: TransactionDisplayProps = {
  account: 'Chequing',
  amount: 20,
  category: 'Eating Out',
  date: new Date(),
  description: 'Family Dinner',
  type: TransactionType.EXPENSE,
};

export const simpleTransaction = () => <Transaction {...exampleTranscation}></Transaction>;
