import { observable } from "mobx";
import { TransactionProps } from "../util/types/TransactionTypes";

class ApplicationStore {
  @observable
  transactions_raw: TransactionProps[] = [];

  @observable
  categories_raw: any[] = [];
}


export default new ApplicationStore();