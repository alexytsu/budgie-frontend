import * as React from "react";
import { Component } from "react";

import Graph, { BudgetGraphProps } from "../components/graph/Graph";
import PieChart, {AccountChartProps} from "../components/graph/Chart";
import ApplicationStore from "../../stores/ApplicationStore";
import AccountsList from "../components/accounts/AccountsList"
import AccountSceneStore from "../../stores/AccountSceneStore";
import { observer } from "mobx-react";
import { TransactionListDateSections } from "../components/transaction/TransactionLists";
import AccountHeader from "../components/accounts/AccountHeader";


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
            <div className="flex-auto w-11/12 h-full">
                
                <div className="flex-auto bg-blue-900 p-1 text-white font-bold rounded-lg">
                    <h1 className="ml-2">ACCOUNTS</h1>
                </div>
                <div className="flex-auto h-10 object-center p-2 rounded-lg bg-blue-600 text-white">
                    <AccountsList></AccountsList>
                </div>
                

                <div className="flex-auto h-full w-1/5 flex-col overflow-auto float-left p-1 mt-6">
                    <TransactionListDateSections
                        transactions={transactions}
                    ></TransactionListDateSections>
                </div>
                
                
                <div className="flex-auto float-right w-4/5 mt-6">
                    <div className="flex-auto bg-gray-200 shadow-md p-1 border-gray-500 m-5 mb-20">
                        <AccountHeader></AccountHeader>
                    </div>
                    <div className="flex-auto float-left w-1/2">
                        <PieChart {...Chartprops}></PieChart>
                    </div>
                    <div className="flex-auto float-right w-1/2">
                        <Graph {...Graphprops}></Graph>
                    </div>
                </div>
                
                
            </div>
        
        );
    }
}
