import { observable } from "mobx";
import {
	TransactionResp,
	CreateTransactionReq
} from "../util/types/TransactionTypes";
import { CategoryResp, CreateCategoryReq } from "../util/types/CategoryTypes";
import apiHelpers from "../util/api-helpers";

class ApplicationStore {
	@observable
	transactions_raw: TransactionResp[] = [];

	@observable
	categories_raw: CategoryResp[] = [];

	createCategory = async (token: string, category: CreateCategoryReq) => {
		const cat = await apiHelpers.createCategory(token, category);
		this.categories_raw.push(cat);
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
		const cat = await apiHelpers.getAllCategories(token);
		this.categories_raw.push(cat);
		return cat;
	}

	deleteCategory = async (token: string, id: string) => {
		await apiHelpers.deleteCategory(token, id);
	}
}

export default new ApplicationStore();
