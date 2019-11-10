import { TransactionDisplayProps } from "./TransactionTypes";
import moment = require("moment");

export enum BudgetType {
	LIMIT,
	GOAL
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
