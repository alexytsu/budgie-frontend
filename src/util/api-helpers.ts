import axios from "axios";
import * as moment from "moment";

import { API_URL } from "./config";
import {
	TransactionDisplayProps,
	CreateTransactionReq,
	TransactionResp
} from "./types/TransactionTypes";
import ApplicationStore from "../stores/ApplicationStore";
import { CreateCategoryReq, CategoryResp } from "./types/CategoryTypes";
import {
	BudgetResp,
	BudgetDisplayProps,
	BudgetType,
	CreateBudgetReq
} from "./types/BudgetTypes";
import CategoryStories from "../test/Category.stories";

export interface LoginResp {
	id: number;
	token: string;
}
class ApiHelper {
	async loginUser(username: string, password: string): Promise<LoginResp> {
		const resp = await axios
			.post(API_URL + "/login/", {
				username,
				password
			})
			.catch(e => {
				throw e;
			});

		const data: LoginResp = {
			id: resp.data.id,
			token: resp.data.token
		};

		console.log("Logging In", data);

		return data;
	}

	createCategory = async (
		token: string,
		category: CreateCategoryReq
	): Promise<CategoryResp> => {
		const resp = await axios.post(
			API_URL + "/categories/",
			{ name: category.name, operation: category.operation },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		const new_category: CategoryResp = {
			...resp.data
		};

		return new_category;
	};

	createTransaction = async (
		token: string,
		transaction: CreateTransactionReq
	): Promise<TransactionResp> => {
		const resp = await axios.post(
			API_URL + "/transactions/",
			{ ...transaction },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		const new_transaction: TransactionResp = {
			...resp.data
		};

		return new_transaction;
	};

	createBudget = async (
		token: string,
		budget: CreateBudgetReq
	): Promise<BudgetResp> => {
		const resp = await this.authenticatedPost(token, "savingplans", budget);
		return resp.data;
	};

	async authenticatedPost(token: string, resource: string, data: any) {
		const endpoint = "/" + resource + "/";
		const resp = await axios.post(
			API_URL + endpoint,
			{ ...data },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		return resp;
	}

	getAllCategories = async (token: string) => {
		const resp = await axios.get(API_URL + "/categories/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	deleteCategory = async (token: string, id: string) => {
		const resp = await axios.delete(API_URL + "/categories/" + id, {
			headers: {
				Authorization: "Token " + token
			}
		});
	};

	deleteTransaction = async (token: string, id: number) => {
		const resp = await axios.delete(API_URL + "/transactions/" + id, {
			headers: {
				Authorization: "Token " + token
			}
		});
	};

	updateCategory = async(token: string, id: string, catName: string) => {
		const resp = await axios.patch(
			API_URL + "/categories/" + id,
			{name: catName}, {
				headers: {
					Authorization: "Token " + token
				}
			}
		)
	}

	getAllTransactions = async (token: string) => {
		const resp = await axios.get(API_URL + "/transactions/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	getAllBudgets = async (token: string) => {
		const resp = await this.authenticatedGetAll(token, "savingplans");
		return resp.data;
	};

	async authenticatedGetAll(token: string, resource: string) {
		const endpoint = "/" + resource + "/";
		const resp = await axios.get(API_URL + endpoint, {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp;
	}

	convertBudget = (b_raw: BudgetResp): BudgetDisplayProps => {
		let category = ApplicationStore.categories_raw.find(
			cat_raw => cat_raw.id === b_raw.category
		);

		const transactions = ApplicationStore.transactions_raw
			.filter(tr_raw => tr_raw.category === b_raw.category)
			.filter(tr_raw => moment(tr_raw.date).isBetween(b_raw.startDate, b_raw.endDate))
			.map(tr_raw => this.convertTransaction(tr_raw));

		const spent = transactions.reduce((sum: number, transaction) => {
			return sum + transaction.amount;
		}, 0);

		const b: BudgetDisplayProps = {
			id: b_raw.id,
			category: category === undefined ? "Foreign Key Error" : category.name,
			endDate: moment(b_raw.endDate, "YYYY-MM-DD").toDate(),
			startDate: moment(b_raw.startDate, "YYYY-MM-DD").toDate(),
			limit: b_raw.amount,
			spent,
			transactions,
			type: BudgetType.LIMIT
		};

		return b;
	};

	convertTransaction = (tr_raw: TransactionResp): TransactionDisplayProps => {
		// must be called from within a render function

		const category_name = ApplicationStore.categories_raw.filter(
			cat_raw => cat_raw.id === tr_raw.category
		)[0];

		const tr: TransactionDisplayProps = {
			account: "Test",
			amount: tr_raw.amount,
			category: tr_raw.category,
			type: tr_raw.operation,
			date: new Date(tr_raw.date),
			description: "",
			id: tr_raw.id
		};

		return tr;
	};
}

export default new ApiHelper();
