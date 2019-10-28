import { TransactionType } from "./TransactionTypes";

export interface CreateCategoryReq {
  name: string;
  operation: TransactionType;
}

export interface CategoryResp {
  id: number;
  name: string;
  operation: TransactionType;
}

