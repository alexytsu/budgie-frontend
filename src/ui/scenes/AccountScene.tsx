import * as React from "react";
import { Component } from "react";

import Graph, { BudgetGraphProps } from "../components/graph/Graph";
import ApplicationStore from "../../stores/ApplicationStore";

/**
 * Currently no accounts. Shows list of all transactions in Store
 */
export default class AccountScene extends Component <{}, any>{ 

    render() {
        const expenseGraph: BudgetGraphProps = {
            transactions: ApplicationStore.transactions_raw,
            budget: 1000
        }
          
        return (
            <div className="">
                <Graph {...expenseGraph}></Graph>
            </div>
        );
    }
}
