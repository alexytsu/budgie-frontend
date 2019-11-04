import { TransactionDisplayProps } from "./TransactionTypes";

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
}

export interface BudgetResp {
	id: number;
	startDate: Date;
	endDate: Date;
	categoryId: number;
	amount: number;
}

export interface CreateBudgetReq {
	startDate: Date;
	endDate: Date;
	categoryId: number;
	amount: number;
}
