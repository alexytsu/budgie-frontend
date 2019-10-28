import { observable } from "mobx";
import { TransactionProps, TranscationResp } from "../util/types/TransactionTypes";

class ApplicationStore {
  @observable
  transactions_raw: TranscationResp[] = [];

  @observable
  categories_raw: any[] = [];
}


export default new ApplicationStore();