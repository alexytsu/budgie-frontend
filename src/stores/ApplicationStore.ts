import { observable } from "mobx";
import {
	TransactionResp,
	CreateTransactionReq
} from "../util/types/TransactionTypes";
import { CategoryResp, CreateCategoryReq } from "../util/types/CategoryTypes";
import apiHelpers from "../util/api-helpers";
import { BudgetResp, CreateBudgetReq } from "../util/types/BudgetTypes";

class ApplicationStore {
	@observable
	transactions_raw: TransactionResp[] = [];

	@observable
	categories_raw: CategoryResp[] = [];

	@observable
	budgets_raw: BudgetResp[] = [];

	@observable
	selected: string = "";
	
	token: string = "";

	init = async(token: string) => {
		this.categories_raw = await apiHelpers.getAllCategories(token);
		this.budgets_raw = await apiHelpers.getAllBudgets(token);
		this.transactions_raw = await apiHelpers.getAllTransactions(token);
	}

	createBudget = async (token: string, budget: CreateBudgetReq) => {
		const b = await apiHelpers.createBudget(token, budget);
		this.budgets_raw.push(b);
		return b;
	}
	
	createCategory = async (token: string, category: CreateCategoryReq) => {
		const cat = await apiHelpers.createCategory(token, category);
		//this.categories_raw.push(cat);
		this.categories_raw = await apiHelpers.getAllCategories(token)
		return cat;
	};

	createTransaction = async (
		token: any,
		newTransaction: CreateTransactionReq
	) => {
		const tr = await apiHelpers.createTransaction(token, newTransaction);
		this.transactions_raw.push(tr);
		return tr;
	};

	getAllCategories = async(token: string) => {
		//const cat = await apiHelpers.getAllCategories(token);
		//this.categories_raw.push(cat);
		return this.categories_raw;
	}

	deleteCategory = async (token: string, id: string) => { 
		await apiHelpers.deleteCategory(token, id);
		this.categories_raw = await apiHelpers.getAllCategories(token)
		this.selected = ""
	}

	updateCategory = async (token: string, id: string, catName: string) => {
		const cat = await apiHelpers.updateCategory(token, id, catName);
		this.categories_raw = await apiHelpers.getAllCategories(token)
	}
}

export default new ApplicationStore();
