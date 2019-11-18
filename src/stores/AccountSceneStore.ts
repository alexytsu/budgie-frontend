import ApplicationStore, { AppStore } from "./ApplicationStore";
import apiHelpers from "../util/api-helpers";
import { TransactionResp } from "../util/types/TransactionTypes";
import { observable } from "mobx";

interface AccountResp {
    balance: number,
    id: string,
    importDate: string,
    name: string,
    number: string,
    user: number
}

export interface LinkCred {
    loginId: String,
    password: String,
    institution: String,
    secondaryLoginId: null,
    securityCode: null

}

class AccountsStore {
    @observable
    appStore = ApplicationStore

    @observable
    accounts: AccountResp[] = []

    @observable
    transactions: TransactionResp[] = []

    @observable
    selectedAcct: AccountResp

    init = async (token: string) => {
        this.transactions = ApplicationStore.transactions_raw
        this.linkBank(token)
        this.accounts = await apiHelpers.getBankAccounts(token);
        this.selectedAcct = this.accounts[0]
        
        console.log(this.accounts)
    };

    changeSelected(index) {
        this.selectedAcct = this.accounts[index]
    }
    
    getAllAccounts(){
        return this.accounts
    }

    getAccountTransactions() {
        console.log("hi")
        console.log(this.transactions)
        console.log(this.appStore.transactions_raw)

        const filteredTrans = this.appStore.transactions_raw.filter(
            trans => trans.account === this.selectedAcct.id
            
        );

        return filteredTrans
    }

    linkBank(token: String) {
        console.log("linking...")
        const creds: LinkCred = {
            loginId: "gavinBelson",
            password: "hooli2016",
            institution: "AU00000",
            secondaryLoginId: null,
            securityCode: null
        }
        const link = apiHelpers.linkBank(token, creds)
        console.log(link)
        const pull = apiHelpers.getlinkBank(token)

        console.log(pull)
    }

    checkBankLink(token: String) {
        const pull = apiHelpers.getlinkBank(token)
        console.log(pull)
    }

}

export default new AccountsStore();