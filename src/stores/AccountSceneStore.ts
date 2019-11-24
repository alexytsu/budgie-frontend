import ApplicationStore, { AppStore } from "./ApplicationStore";
import apiHelpers from "../util/api-helpers";
import { TransactionResp } from "../util/types/TransactionTypes";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { async } from "q";
import { trackPromise } from "react-promise-tracker";
import UserStore from "./UserStore";
import { resolve } from "url";
import { userInfo } from "os";
import { number } from "prop-types";

interface AccountResp {
    balance: number,
    id: string,
    importDate: string,
    name: string,
    number: string,
    user: number
}

export interface BankDets {
    id: string,
    name: string,
    loginId: string,
    passwordCaption: string,
    secondaryLoginCaption: string,
    securityCodeCaption: string
}

export interface LinkCred {
    loginId: string,
    password: string,
    institution: string,
    secondaryLoginId: string,
    securityCode: number

}

export interface accountdetails {
    bank: string,
    id: string,
    loginId: string,
    userInfo: number
}

class AccountsStore {

    @observable
    useraccounts: accountdetails[] = []

    @observable
    banks: BankDets[] = []

    @observable 
    appStore = ApplicationStore

    @observable
    accounts: AccountResp[] = []

    @observable
    transactions: TransactionResp[] = []

    @observable
    selectedAcct: AccountResp = {
        balance: 0,
        id: "",
        importDate: "01-01-0001",
        name: "None",
        number: "",
        user: 1
    }

    @observable
    loading: boolean = false

    init = async (token: string) => {
        this.transactions = ApplicationStore.transactions_raw
        try {
            this.banks = await apiHelpers.getBanks(token)
            await apiHelpers.getBankAccounts(token)
                .then((result) => {
                    this.accounts = result
                    if (result.length !== 0) {
                        this.selectedAcct = this.accounts[0]
                    }
                    
                })
            this.useraccounts = await apiHelpers.getuserbank(token)
        } catch {
            console.log("oh no")
            console.log(this.accounts)
        }
        
    };

    changeSelected(index) {
        if (this.accounts.length != 0) {
            this.selectedAcct = this.accounts[index]
        }
    }
    
    getAllAccounts(){
        return this.accounts
    }

    getAccountTransactions() {
        // console.log(this.transactions)
        // console.log(this.appStore.transactions_raw)
        const filteredTrans = this.appStore.transactions_raw.filter(
            trans => trans.account === this.selectedAcct.id  
        );
        return filteredTrans
    }

    linkBank = async(token: string, bankForm: LinkCred) => {
        console.log("linking...")
        console.log(bankForm)

        await apiHelpers.linkBank(token, bankForm)
            .then((result) => {
                console.log(result)
            })

        this.loading = true
        this.checkBankLink(token)

    }

    checkBankLink = async(token: string) => {

        const sleep = (millisec) => {
            return new Promise(resolve => setTimeout(resolve, millisec))
        }

        while (this.loading) {
            console.log("loading...")
            await apiHelpers.getlinkBank(token)
            .then(result => {
                console.log(result)
                if (result.done === true) {
                    console.log("loading done")
                    ApplicationStore.init(token)
                    this.init(token)
                    this.loading = false
                }
            })
            await sleep(5000)
        }

        
    }

    getuserbank = async (token: string) => {
        await apiHelpers.getuserbank(token)
            .then(result => {
                console.log(result)
                this.useraccounts = result
            })
    }

    deleteBank = async (token: string, id: string) => {
        await apiHelpers.deleteBank(token, id)
            .then(result => {
                console.log(result)
                ApplicationStore.init(token)
                this.init(token)
                this.reset()
            })
        
    }

    reset() {
        
        this.banks = []
        this.accounts = []
        this.transactions = []
        this.selectedAcct = {
            balance: 0,
            id: "",
            importDate: "01-01-0001",
            name: "None",
            number: "",
            user: 1
        }
    }
}

export default new AccountsStore();