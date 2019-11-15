import { observable, computed } from "mobx";
import {
	TransactionResp,
	CreateTransactionReq
} from "../util/types/TransactionTypes";
import { CategoryResp, CreateCategoryReq } from "../util/types/CategoryTypes";
import apiHelpers from "../util/api-helpers";
import { BudgetResp, CreateBudgetReq } from "../util/types/BudgetTypes";
import { computedFn } from "mobx-utils";
import moment = require("moment");
import Budget from "../ui/components/budget/Budget";

export interface AppStore {
	transactions_raw: TransactionResp[];
	categories_raw: CategoryResp[];
	budgets_raw: BudgetResp[];
	selectedCategoryId: number;

	createBudget(token: string, budget:CreateBudgetReq): Promise<BudgetResp>;
	updateBudget(token: string, id: number, budget: CreateBudgetReq): Promise<BudgetResp>;
	deleteBudget(token: string, id: number);
}

class ApplicationStore implements AppStore {
	@observable
	transactions_raw: TransactionResp[] = [];

	@observable
	categories_raw: CategoryResp[] = [];

	@observable
	budgets_raw: BudgetResp[] = [];

	@observable
	selectedCategoryId: number = 0;

	@observable
	selectedTransactionId: number = 0;

	token: string = "";

	init = async (token: string) => {
		this.categories_raw = await apiHelpers.getAllCategories(token);
		this.budgets_raw = await apiHelpers.getAllBudgets(token);
		this.transactions_raw = await apiHelpers.getAllTransactions(token);
	};

	createBudget = async (token: string, budget: CreateBudgetReq):Promise<BudgetResp> => {
		const b = await apiHelpers.createBudget(token, budget);
		this.budgets_raw.push(b);
		return b;
	};


	@computed
	get netWorth() {
		return this.transactions_raw.reduce((sum, tr) => {
			return (sum -= tr.amount);
		}, 0);
	}

	@computed
	get transactionIsSelected() {
		return this.selectedTransactionId !== 0;
	}

	deleteSelectedTransaction = (token: string) => {
		this.deleteTransaction(token, this.selectedTransactionId);
	}

	clearSelectedTransaction = () => {
		this.selectedTransactionId = 0;
	}

	getNetWorthOn = computedFn(function getNetWorthOn(date: moment.Moment): number {
		const transactions = this.transactions_raw.filter(tr =>
			moment(tr.date).isSameOrBefore(date)
		);
		return transactions.reduce((sum, tr) => {
			return sum -= tr.amount.toFixed(2);
		}, 0).toFixed(2);
	});

	getAmountBudgetdOn = computedFn(function getAmountBudgetdOn(date: moment.Moment) {
		const budgets = this.budgets_raw.filter(b => date.isBetween(moment(b.startDate), moment(b.endDate), "day", "[]"));
		
		const budgeted =  budgets.reduce((sum, b) => {
			return sum += b.amount;
		}, 0);

		return budgeted.toFixed(2);
	});

	createCategory = async (token: string, category: CreateCategoryReq) => {
		try {
			const cat = await apiHelpers.createCategory(token, category);
			//this.categories_raw.push(cat);
			this.categories_raw = await apiHelpers.getAllCategories(token);
			return cat;
		} catch (e) {
			const response: CategoryResp = {
				name: e.response.data.name,
				id: null,
				operation: null
			};
			return response;
		}
	};

	createTransaction = async (
		token: any,
		newTransaction: CreateTransactionReq
	) => {
		const tr = await apiHelpers.createTransaction(token, newTransaction);
		this.transactions_raw.push(tr);
		return tr;
	};

	getAllCategories = async (token: string) => {
		//const cat = await apiHelpers.getAllCategories(token);
		//this.categories_raw.push(cat);
		return this.categories_raw;
	};

	deleteBudget = async (token: string, id: number) => {
		await apiHelpers.deleteBudget(token, id);
		const loc = this.budgets_raw.findIndex(b => b.id === id);
		this.budgets_raw.splice(loc, 1);
	}

	deleteCategory = async (token: string, id: number) => {
		await apiHelpers.deleteCategory(token, id);
		this.categories_raw = await apiHelpers.getAllCategories(token);
		this.selectedCategoryId = 0;
	};


	updateCategory = async (token: string, id: string, catName: string) => {
		const cat = await apiHelpers.updateCategory(token, id, catName);
		this.categories_raw = await apiHelpers.getAllCategories(token);
	};

	updateBudget = async (
		token: string,
		id: number,
		budgetProps: CreateBudgetReq
	): Promise<BudgetResp> => {
		const bud = await apiHelpers.updateBudget(token, id, budgetProps);
		this.budgets_raw = this.budgets_raw.filter(b => b.id !== id);
		this.budgets_raw.push(bud);
		return bud;
	};

	deleteTransaction = async (token: string, id: number) => {
		await apiHelpers.deleteTransaction(token, id);
		const loc = this.transactions_raw.findIndex(tr => tr.id === id);
		this.transactions_raw.splice(loc, 1);
	};
}

export default new ApplicationStore();
