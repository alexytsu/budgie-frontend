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
import BankForm from "../components/accounts/LinkAccount";


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
    // settimeout
    
    render() {

        let Graphprops: BudgetGraphProps = {
            key: AccountSceneStore.selectedAcct.id,
            transactions: AccountSceneStore.getAccountTransactions(),
            budget: 0
        }
        let Chartprops: AccountChartProps = {
            key: AccountSceneStore.selectedAcct.id,
            transactions: AccountSceneStore.getAccountTransactions(),
            categories: ApplicationStore.categories_raw
        }

        let transactions = AccountSceneStore.getAccountTransactions()

        return (
            <div className="flex-auto w-11/12 h-full">
                <div className="flex-auto float-left w-4/5 my-2 pr-5">
                    <div className="flex-auto bg-gray-900 p-1 h-20 text-white font-bold rounded-lg">
                        <h1 className="ml-2 text-lg">ACCOUNTS</h1>
                        <div className="flex-auto h-10 w-11/12 p-1 ml-12 mt-2 rounded-lg text-white">
                            <AccountsList></AccountsList>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex-auto bg-gray-200 rounded-lg border-gray-500 w-2/3 float-left">
                            <AccountHeader></AccountHeader>
                        </div>
                        <div className="float-right w-1/3 h-40">
                            <BankForm></BankForm>
                        </div>
                    </div>
                    
                    <div className="">
                        <div className="flex-auto float-right w-1/2 mt-32">
                            <PieChart {...Chartprops}></PieChart>
                        </div>
                        <div className="flex-auto float-left w-1/2 pr-5 mt-32">
                            <Graph {...Graphprops}></Graph>
                        </div>
                    </div>
                    
                </div>
                <div className="">
                    <div className="flex-auto h-full w-1/5 flex-col overflow-auto float-right p-5">
                        <TransactionListDateSections
                            transactions={transactions}
                        ></TransactionListDateSections>
                    </div>

                </div>
                
            </div>
        
        );
    }
}
