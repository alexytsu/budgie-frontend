import * as React from "react";
import { Component } from "react";

import Graph, { BudgetGraphProps } from "../components/graph/Graph";
import PieChart, {AccountChartProps} from "../components/graph/Chart";
import ApplicationStore from "../../stores/ApplicationStore";
import AccountsList from "../components/accounts/AccountsList"
import AccountSceneStore from "../../stores/AccountSceneStore";
import { observer } from "mobx-react";
import { TransactionListDateSections } from "../components/transaction/TransactionLists";


/**
 * Currently no accounts. Shows list of all transactions in Store
 */
@observer
export default class AccountScene extends Component <{}, any>{ 

    // TODO
    // TITLE
    // MENU OF ACCOUNTS
    // PIE CHART OF WHERE MONEY IS GOING TO
    // LIST OF FILTER TRANSACTIONS PER ACCOUNT
    
    render() {
        let Graphprops: BudgetGraphProps = {
            key: AccountSceneStore.selectedAcct.id,
            transactions: AccountSceneStore.getAccountTransactions(),
            budget: AccountSceneStore.selectedAcct.balance
        }
        let Chartprops: AccountChartProps = {
            key: AccountSceneStore.selectedAcct.id,
            transactions: AccountSceneStore.getAccountTransactions(),
            categories: ApplicationStore.categories_raw
        }

        let transactions = AccountSceneStore.getAccountTransactions()

        console.log(transactions)

        return (
            <div className="flex-1">
                <div className="flex-auto">
                    <h1>ACCOUNTS</h1>
                </div>
                <div className="">
                    <AccountsList></AccountsList>
                </div>
                
                <div className="w-full h-full flex flex-col overflow-y-scroll mt-4 mr-4 rounded-lg px-4 bg-white">
						<TransactionListDateSections
							transactions={transactions}
						></TransactionListDateSections>
					</div>
                <div className="">
                    <PieChart {...Chartprops}></PieChart>
                </div>
                <Graph {...Graphprops}></Graph>
            </div>
        
        );
    }
}
