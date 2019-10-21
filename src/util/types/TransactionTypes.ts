export interface TransactionProps {
    id: number;
    amount: number;
    category_id: number;
}

export enum TransactionType {
    INCOME,
    EXPENSE,
}

export interface TransactionDisplayProps {
    amount: number;
    description: string;
    date: Date;
    category: string;
    account: string;
    type: TransactionType;
}