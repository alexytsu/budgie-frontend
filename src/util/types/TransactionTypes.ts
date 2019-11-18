export interface TransactionProps {
    id: number;
    amount: number;
    category_id: number;
}

export enum TransactionType {
    INCOME = "IN",
    EXPENSE = "OUT",
}

export interface TransactionDisplayProps {
    amount: number;
    description: string;
    date: Date;
    category: number | string;
    account: string;
    type: TransactionType;
    id: number;
}

export interface CreateTransactionReq {
    amount: number;
    date: string;
    category: number;
    account: string;
    description: string;
}


export interface TransactionResp {
    id: number;
    amount: number;
    date: string;
    operation: TransactionType;
    category: number;
    account: string;
    user: number;
    description: string;
}

