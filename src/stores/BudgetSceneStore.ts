import { observable, computed, autorun } from "mobx";
import ApplicationStore, { AppStore } from "./ApplicationStore";
import moment = require("moment");
import {
	CreateBudgetReq,
	BudgetResp,
	BudgetPeriod,
	BudgetSuggestions
} from "../util/types/BudgetTypes";
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

	@observable
	sceneDatePicker: {
		focus: "startDate" | "endDate" | null;
		startDate: moment.Moment;
		endDate: moment.Moment;
		filtering: boolean;
	} = {
		focus: null,
		startDate: moment().subtract(1, "year"),
		endDate: moment(),
		filtering: false
	};

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

	@computed
	get filteredBudgets(): BudgetResp[] {
		if (this.sceneDatePicker.filtering) {
			return this.appData.budgets_raw.filter(bud => {
				return (
					moment(bud.startDate, "YYYY-MM-DD").isBetween(
						this.sceneDatePicker.startDate,
						this.sceneDatePicker.endDate,
						"date",
						"[]"
					) ||
					moment(bud.endDate, "YYYY-MM-DD").isBetween(
						this.sceneDatePicker.startDate,
						this.sceneDatePicker.endDate,
						"date",
						"[]"
					)
				);
			});
		}
		return this.appData.budgets_raw;
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

	deleteBudget(token: string) {
		this.appData.deleteBudget(token, this.selectedBudgetId);
	}

	getSuggestions(): BudgetSuggestions {
		const oldStart = moment(this.currentBudget.startDate, "YYYY-MM-DD");
		const oldEnd = moment(this.currentBudget.endDate, "YYYY-MM-DD");
		const period = oldEnd.diff(oldStart, "days");
		const previousStart = moment(this.currentBudget.startDate, "YYYY-MM-DD").subtract(period+1, "days");

		const previousSpent = this.allTransactionsCategory
			.filter(tr => {
				return moment(tr.date, "YYYY-MM-DD").isBetween(previousStart, oldStart, "date", "[)")
			})
			.reduce((sum, tr) => {
				return (sum += tr.amount);
			}, 0);

		const ret: BudgetSuggestions = {
			previousAmount: previousSpent,
			previousDateStart: previousStart,
			previousDateEnd: oldStart.subtract(1, "day"),	
		};

		return ret;
	}

	autobalance() {
		const budget = apiHelpers.convertBudget(this.currentBudget);
		const spent = budget.spent;
		if (budget.period === BudgetPeriod.CURRENT) {
			const ratio =
				moment().diff(
					moment(this.currentBudget.startDate, "YYYY-MM-DD"),
					"days"
				) /
				moment(this.currentBudget.endDate, "YYYY-MM-DD").diff(
					moment(this.currentBudget.startDate, "YYYY-MM-DD"),
					"days"
				);

			this.newBudget.amount = Math.ceil(spent / ratio);
		} else if (budget.period === BudgetPeriod.PAST) {
			this.newBudget.amount = budget.spent;
		}
	}
}

export default new BudgetSceneStore();
