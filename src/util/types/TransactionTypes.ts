export interface TransactionProps {
    id: number;
    amount: number;
    category_id: number;
}

export interface TranscationResp {
    amount: number;
    date: string;
    operation: TransactionType;
    category: number;
    user: number;
}

export enum TransactionType {
    INCOME = "IN",
    EXPENSE = "OUT",
}

export interface TransactionDisplayProps {
    amount: number;
    description: string;
    date: Date;
    category: string;
    account: string;
    type: TransactionType;
}