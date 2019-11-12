import * as React from "react";

import Budget from "../ui/components/budget/Budget";
import { BudgetDisplayProps, BudgetType, BudgetPeriod } from "../util/types/BudgetTypes";
import BudgetScene from "../ui/scenes/BudgetScene";
import AddNewBudgetModal from "../ui/components/budget/AddNewBudgetModal";

export default { title: "Budgets" };

const emptyBudgetProps: BudgetDisplayProps = {
  id: 1,
  category: "Eating Out",
  endDate: new Date(2019, 10, 10),
  limit: 500,
  spent: 0,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT,
  transactions: [],
  period: BudgetPeriod.CURRENT,
}

export const emptyBudget = () => (
  <Budget {...emptyBudgetProps}></Budget>
)

const underSpentBudgetProps: BudgetDisplayProps = {
  id: 1,
  category: "Eating Out",
  endDate: new Date(2019, 10, 10),
  limit: 500,
  spent: 240,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT,
  transactions: [],
  period: BudgetPeriod.CURRENT,
}

export const underSpentBudget = () => (
  <Budget {...underSpentBudgetProps}></Budget>
)

const overSpentBudgetProps: BudgetDisplayProps = {
  id: 1,
  category: "Eating Out",
  endDate: new Date(2019, 10, 10),
  limit: 500,
  spent: 480,
  startDate: new Date(2019, 9, 1),
  type: BudgetType.LIMIT,
  transactions: [],
  period: BudgetPeriod.CURRENT,
}

export const overSpentBudget = () => (
  <Budget {...overSpentBudgetProps}></Budget>
)

export const budgetScene = () => (
  <BudgetScene></BudgetScene>
)

export const addBudgetModal = () => (
  <AddNewBudgetModal></AddNewBudgetModal>
)
