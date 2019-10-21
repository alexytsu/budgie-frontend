export enum BudgetType {
  LIMIT,
  GOAL,
}

export interface BudgetDisplayProps {
    limit: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    category: string;
    type: BudgetType;
}