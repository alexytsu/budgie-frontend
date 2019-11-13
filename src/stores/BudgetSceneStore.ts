import * as React from "react";
import { observable, computed } from "mobx";
import ApiHelper from "../util/api-helpers";
import ApplicationStore, { AppStore } from "./ApplicationStore";
import Budget from "../ui/components/budget/Budget";
import moment = require("moment");
import { CreateBudgetReq, BudgetResp } from "../util/types/BudgetTypes";
import apiHelpers from "../util/api-helpers";

class BudgetSceneStore {
	@observable
	appData: AppStore;

	@observable
	selectedBudgetId: number = 1;

	@observable
	modalOpen: boolean = false;

	@observable
	newBudget: CreateBudgetReq;

	@observable
	newBudgetDatePickerFocus: "startDate" | "endDate" | null = null;

	constructor() {
		this.appData = ApplicationStore;
	}

	@computed
	get allTransactionsCategory() {
		return this.appData.transactions_raw.filter(
			tr => tr.category === this.currentCategoryId
		);
	}

	openModal() {
		this.modalOpen = true;
	}

	closeModal() {
		this.modalOpen = false;
	}

	@computed
	get allTransactionsBudget() {
		const startDate = moment(this.currentBudget.startDate, "YYYY-MM-DD");
		const endDate = moment(this.currentBudget.endDate, "YYYY-MM-DD");
		return this.allTransactionsCategory.filter(tr =>
			moment(tr.date, "YYYY-MM-DD").isBetween(startDate, endDate, "day", "[]")
		);
	}

	@computed
	get currentBudget() {
		const budget = this.appData.budgets_raw.find(
			b => b.id === this.selectedBudgetId
		);
		return budget === undefined ? this.appData.budgets_raw[0] : budget;
	}

	@computed
	get currentCategory() {
		return this.appData.categories_raw.find(
			cat => cat.id === this.currentCategoryId
		);
	}

	@computed
	get currentCategoryId(): number {
		const budget = this.appData.budgets_raw.find(
			b => b.id === this.selectedBudgetId
		);

		return budget === undefined ? 0 : budget.category;
	}

	selectBudget(b: BudgetResp) {
		this.selectedBudgetId = b.id;
		this.newBudget = {
			amount: b.amount,
			category: b.category,
			endDate: b.endDate,
			startDate: b.startDate
		};
	}

	updateBudget(token: string) {
		this.appData.updateBudget(token, this.selectedBudgetId, this.newBudget);
	}

	autobalance() {
		const spent = apiHelpers.convertBudget(this.currentBudget).spent;
		const ratio =
			moment().diff(moment(this.currentBudget.startDate, "YYYY-MM-DD"), "days") /
			moment(this.currentBudget.endDate, "YYYY-MM-DD").diff(
				moment(this.currentBudget.startDate, "YYYY-MM-DD"),
				"days"
			);

			this.newBudget.amount = Math.ceil(spent/ratio);
	}
}

export default new BudgetSceneStore();
