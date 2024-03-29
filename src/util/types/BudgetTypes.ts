import { TransactionDisplayProps } from "./TransactionTypes";
import moment = require("moment");

export enum BudgetType {
	LIMIT,
	GOAL
}

export enum BudgetPeriod {
	PAST = "Past",
	CURRENT= "Current",
	FUTURE = "Future"
}

export interface BudgetDisplayProps {
	id: number;
	limit: number;
	spent: number;
	startDate: Date;
	endDate: Date;
	category: string;
	type: BudgetType;
	transactions: TransactionDisplayProps[];
	selected?: boolean;
	period:BudgetPeriod;
}

export interface BudgetResp {
	id: number;
	startDate: string;
	endDate: string;
	category: number;
	amount: number;
}

export interface CreateBudgetReq {
	startDate: string;
	endDate: string;
	category: number;
	amount: number;
}


export interface BudgetSuggestions {
	message?: string;
	previousAmount: number;
	previousDateStart: moment.Moment;
	previousDateEnd: moment.Moment;
}
