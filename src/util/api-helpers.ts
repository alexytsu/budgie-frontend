import axios from "axios";
import * as moment from "moment";

import { API_URL } from "./config";
import {
	TransactionDisplayProps,
	CreateTransactionReq,
	TransactionResp,
	TransactionType
} from "./types/TransactionTypes";
import ApplicationStore from "../stores/ApplicationStore";
import { CreateCategoryReq, CategoryResp } from "./types/CategoryTypes";
import {
	BudgetResp,
	BudgetDisplayProps,
	BudgetType,
	CreateBudgetReq,
	BudgetPeriod
} from "./types/BudgetTypes";
import { LinkCred } from "../stores/AccountSceneStore"
import CategoryStories from "../test/Category.stories";
import Budget from "../ui/components/budget/Budget"
import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { async } from "q";

export type MoneyAtMoment = {
	date: moment.Moment;
	amount: number;
};

export interface LoginResp {
	id: number;
	token: string;
}

export interface RegistrationResp {
	username: string;
	email: string;
	id: number;
	first_name: string;
	last_name: string;
}

export interface UserResp {
	username: string;
	email: string;
	id: number;
	first_name: string;
	last_name: string;
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

	async registerUser(
		username: string,
		password: string,
		email: string,
		first_name: string,
		last_name: string
	): Promise<RegistrationResp> {
		const resp = await axios.post(API_URL + "/users/", {
			username,
			password,
			email,
			first_name,
			last_name
		});

		const data: RegistrationResp = {
			email: resp.data.email,
			first_name: resp.data.first_name,
			last_name: resp.data.last_name,
			id: resp.data.id,
			username: resp.data.username
		};

		return data;
	}

	createCategory = async (
		token: string,
		category: CreateCategoryReq
	): Promise<CategoryResp> => {
		const resp = await axios
			.post(
				API_URL + "/categories/",
				{ name: category.name, operation: category.operation },
				{
					headers: {
						Authorization: "Token " + token
					}
				}
			)
			.catch(e => {
				throw e;
			});

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
		const resp = await this.authenticatedPost(token, "spendingplans", budget);
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

	getUserDetails = async (token: string, id: number): Promise<UserResp> => {
		const resp = await axios.get(API_URL + "/users/" + id, {
			headers: {
				Authorization: "Token " + token
			}
		});

		const data: UserResp = {
			email: resp.data.email,
			first_name: resp.data.first_name,
			last_name: resp.data.last_name,
			username: resp.data.username,
			id: resp.data.id,
		};

		return data;
	};

	getAllCategories = async (token: string) => {
		const resp = await axios.get(API_URL + "/categories/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	deleteBudget = async (token: string, id: number) => {
		const resp = await axios.delete(API_URL + "/spendingplans/" + id, {
			headers: {
				Authorization: "Token " + token
			}
		});
	};

	deleteCategory = async (token: string, id: number) => {
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

	updateCategory = async (token: string, id: string, catName: string) => {
		const resp = await axios.patch(
			API_URL + "/categories/" + id,
			{ name: catName },
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);
	};

	round = (value: number, decimals: number): number => {
		return Math.round(value * 100) / 100;
	};

	updateBudget = async (
		token: string,
		id: number,
		budgetProps: CreateBudgetReq
	): Promise<BudgetResp> => {
		const resp = await axios.patch(
			API_URL + "/spendingplans/" + id + "/",
			budgetProps,
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		const bud: BudgetResp = {
			amount: resp.data.amount,
			category: resp.data.category,
			endDate: resp.data.endDate,
			startDate: resp.data.startDate,
			id: resp.data.id
		};

		return bud;
	};

	getAllTransactions = async (token: string) => {
		const resp = await axios.get(API_URL + "/transactions/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	getAllBudgets = async (token: string) => {
		const resp = await this.authenticatedGetAll(token, "spendingplans");
		return resp.data;
	};


	getBanks = async (token: string) => {
		const resp = await axios.get(API_URL + "/banks/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	getBankAccounts = async (token: string) => {
		const resp = await axios.get(API_URL + "/bankaccounts/", {
			headers: {
				Authorization: "Token " + token
			}
		});

		return resp.data;
	};

	linkBank = async (token: String, creds: LinkCred) => {
		const resp = await axios.post(
			API_URL + "/bankconnection/", 
			{...creds},
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		return resp.data
	}

	getlinkBank = async (token: string) => {
		const resp = await axios.get(
			API_URL + "/bankconnection/", 
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		);

		return resp.data
	}

	deleteBank = async (token: string) => {
		const resp = await axios.delete(
			API_URL + "/bankconnection/",
			{
				headers: {
					Authorization: "Token " + token
				}
			}
		)

		return resp.data
	}

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
			.filter(tr_raw =>
				moment(tr_raw.date).isBetween(b_raw.startDate, b_raw.endDate)
			)
			.map(tr_raw => this.convertTransaction(tr_raw));

		const spent: number = this.round(
			transactions.reduce((sum: number, transaction) => {
				return sum + transaction.amount;
			}, 0),
			2
		);

		// See if the budget is finished, ongoing or upcoming
		let period = BudgetPeriod.CURRENT;

		const endMoment = moment(b_raw.endDate, "YYYY-MM-DD");
		const startMoment = moment(b_raw.startDate, "YYYY-MM-DD");
		const today = moment();

		if (today.isBefore(startMoment, "date")) {
			period = BudgetPeriod.FUTURE;
		} else if (today.isAfter(endMoment, "date")) {
			period = BudgetPeriod.PAST;
		}

		const b: BudgetDisplayProps = {
			id: b_raw.id,
			category: category === undefined ? "Foreign Key Error" : category.name,
			endDate: endMoment.toDate(),
			startDate: startMoment.toDate(),
			limit: b_raw.amount,
			spent,
			transactions,
			type: BudgetType.LIMIT,
			period
		};

		return b;
	};

	convertTransaction = (tr_raw: TransactionResp): TransactionDisplayProps => {
		// must be called from within a render function

		const category_name = ApplicationStore.categories_raw.filter(
			cat_raw => cat_raw.id === tr_raw.category
		)[0];

		const type =
			tr_raw.amount >= 0 ? TransactionType.EXPENSE : TransactionType.INCOME;

		const tr: TransactionDisplayProps = {
			account: "Test",
			amount: tr_raw.amount,
			category: tr_raw.category,
			date: new Date(tr_raw.date),
			description: tr_raw.description,
			id: tr_raw.id,
			type
		};

		return tr;
	};

	transactionRunningSum = (
		acc: MoneyAtMoment[],
		tr: TransactionDisplayProps | TransactionResp,
		granularity: moment.unitOfTime.StartOf
	) => {
		const len = acc.length;
		if (len === 0) {
			acc.push({
				date: moment(tr.date),
				amount: -tr.amount
			});
		} else if (acc[len - 1].date.isSame(moment(tr.date), granularity)) {
			acc[len - 1].amount -= tr.amount;
		} else {
			acc.push({
				date: moment(tr.date),
				amount: acc[len - 1].amount - tr.amount
			});
		}
		return acc;
	};
}

export default new ApiHelper();
