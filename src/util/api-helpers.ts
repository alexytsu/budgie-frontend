import axios from "axios";

import { API_URL } from "./config";
import {
	TransactionDisplayProps,
	CreateTransactionReq,
	TransactionResp
} from "./types/TransactionTypes";
import ApplicationStore from "../stores/ApplicationStore";
import { CreateCategoryReq, CategoryResp } from "./types/CategoryTypes";

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

	createCategory = async (token: string, category: CreateCategoryReq): Promise<CategoryResp> => {
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
			... resp.data
		}

		return new_category;
	};

	createTransaction = async(token: string, transaction: CreateTransactionReq): Promise<TransactionResp> => {
		const resp = await axios.post(
			API_URL + "/transactions/",
			{ ... transaction },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		const new_transaction: TransactionResp = {
			... resp.data
		}

		return new_transaction;
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
		const resp = await axios.delete(
			API_URL + "/categories/" + id, {
				headers: {
					Authorization: "Token " + token
				}
		})
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

	convertTransaction = (
		tr_raw: TransactionResp
	): TransactionDisplayProps => {
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
			id: tr_raw.id,
		};

		return tr;
	};
}

export default new ApiHelper();
