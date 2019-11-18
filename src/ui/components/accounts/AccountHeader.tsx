import React = require("react");
import AccountsStore from "../../../stores/AccountSceneStore";
import { observer } from "mobx-react";

@observer
export default class AccountHeader extends React.Component<{}, any>{

    constructor(props) {
        super(props)
        this.state = {
            name: AccountsStore.selectedAcct.name,
            balance: this.calculateBalance(AccountsStore.transactions),
            transactions: AccountsStore.transactions
        }
    }

    calculateBalance(transactions) {
        let balance = AccountsStore.selectedAcct.balance
        transactions.map(trans => {
            balance -= trans.amount
        })
        return balance.toFixed(2)
    }

    render() {
        let name = AccountsStore.selectedAcct.name.toUpperCase()
        let balance = this.calculateBalance(AccountsStore.getAccountTransactions())
        return(
            <div className="h-40 ml-4">
                <h1 className="text-xl p-1 mb-2 mt-3 font-bold">{name}</h1>
                <div className="text-xs mt-16">Available</div>
                <div className="text-sm ">${balance}</div>
            </div>
        )
    }
}