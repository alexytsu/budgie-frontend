import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";
import ApplicationStore, { AppStore } from "./ApplicationStore";
import Budget from "../ui/components/budget/Budget";
import moment = require("moment");


class BudgetSceneStore {

	appData: AppStore;

	@observable
	selectedBudgetId:number = 1;

	constructor() {
		this.appData = ApplicationStore;
	}

	@computed
	get allTransactionsCategory() {
		return this.appData.transactions_raw.filter(tr => tr.category === this.currentCategoryId);
	}

	@computed
	get allTransactionsBudget() {
		const startDate = moment(this.currentBudget.startDate, "YYYY-MM-DD");
		const endDate = moment(this.currentBudget.endDate, "YYYY-MM-DD");
		return this.allTransactionsCategory.filter(
			tr => moment(tr.date, "YYYY-MM-DD").isBetween(startDate, endDate, "day", "[]")
		);
	}

	@computed
	get currentBudget() {
		const budget = this.appData.budgets_raw.find(b=>b.id === this.selectedBudgetId);
		return budget === undefined ? this.appData.budgets_raw[0] : budget;
	}

	@computed
	get currentCategoryId():number {
		const budget = this.appData.budgets_raw.find(b => b.id === this.selectedBudgetId);

		return budget === undefined ? 0:budget.category;
	}


}

export default new BudgetSceneStore();