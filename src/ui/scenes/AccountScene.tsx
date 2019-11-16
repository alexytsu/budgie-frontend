import * as React from "react";
import { Component } from "react";

import Graph, { BudgetGraphProps } from "../components/graph/Graph";
import PieChart, {AccountChartProps} from "../components/graph/Chart";
import ApplicationStore from "../../stores/ApplicationStore";


/**
 * Currently no accounts. Shows list of all transactions in Store
 */
export default class AccountScene extends Component <{}, any>{ 

    // TODO
    // TITLE
    // MENU OF ACCOUNTS
    // PIE CHART OF WHERE MONEY IS GOING TO
    // LIST OF FILTER TRANSACTIONS PER ACCOUNT
    
    render() {
        const Graphprops: BudgetGraphProps = {
            transactions: ApplicationStore.transactions_raw,
            budget: 1000
        }
        const Chartprops: AccountChartProps = {
            transactions: ApplicationStore.transactions_raw,
            categories: ApplicationStore.categories_raw
        }
        return (
            <div className="">
                <div className="">
                    <PieChart {...Chartprops}></PieChart>
                </div>
                <Graph {...Graphprops}></Graph>
            </div>
        );
    }
}
