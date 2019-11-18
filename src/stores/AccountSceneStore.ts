import ApplicationStore, { AppStore } from "./ApplicationStore";
import apiHelpers from "../util/api-helpers";
import { TransactionResp } from "../util/types/TransactionTypes";

interface AccountResp {
    acount: number
}

class AccountsStore {
    appStore = ApplicationStore
    accounts: AccountResp[] = []
    transactions: TransactionResp[] = []

    init = async (token: string) => {
        this.accounts = await apiHelpers.getBankAccounts(token);
        console.log(this.accounts)
        
    };
    
    getAllAccounts(){
        return this.accounts
    }

}

export default new AccountsStore();