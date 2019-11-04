import * as React from "react";
import BudgetGraph from "../ui/components/budget/BudgetGraph";
import ApplicationStore from "../stores/ApplicationStore";
import {TransactionType, TransactionResp } from "../util/types/TransactionTypes";
import {BudgetGraphProps} from "../ui/components/budget/BudgetGraph"

export default { title: "BudgetGraph" };

const expenseGraph: BudgetGraphProps = {
  transactions: ApplicationStore.transactions_raw.filter(type => type.operation == TransactionType.EXPENSE)
}
export const ExpenseGraph = () => (
  <BudgetGraph {...expenseGraph}></BudgetGraph>
)

const incomeGraph: BudgetGraphProps = {
  transactions: ApplicationStore.transactions_raw.filter(type => type.operation == TransactionType.INCOME)
}

export const IncomeGraph = () => (
  <BudgetGraph {...incomeGraph}></BudgetGraph>
)
