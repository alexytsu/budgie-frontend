import * as React from "react";

import Transaction from "../ui/components/transaction/Transaction";
import {
	TransactionDisplayProps,
	TransactionType
} from "../util/types/TransactionTypes";
import Budget from "../ui/components/budget/Budget";
import { BudgetDisplayProps, BudgetType } from "../util/types/BudgetTypes";

export default { title: "Budgets" };

const emptyBudgetProps: BudgetDisplayProps = {
  category: "Eating Out",
  endDate: new Date(2019, 9, 30),
  limit: 500,
  spent: 0,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT
}

export const emptyBudget = () => (
  <Budget {...emptyBudgetProps}></Budget>
)

const underSpentBudgetProps: BudgetDisplayProps = {
  category: "Eating Out",
  endDate: new Date(2019, 9, 30),
  limit: 500,
  spent: 240,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT
}

export const underSpentBudget = () => (
  <Budget {...underSpentBudgetProps}></Budget>
)

const overSpentBudgetProps: BudgetDisplayProps = {
  category: "Eating Out",
  endDate: new Date(2019, 9, 30),
  limit: 500,
  spent: 499,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT
}

export const overSpentBudget = () => (
  <Budget {...overSpentBudgetProps}></Budget>
)