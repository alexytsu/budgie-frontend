import * as React from "react";
import { Component } from "react";

import BudgetGraph, { BudgetGraphProps } from "../components/budget/BudgetGraph";
import ApplicationStore from "../../stores/ApplicationStore";

/**
 * Currently no accounts. Shows list of all transactions in Store
 */
export default class AccountScene extends Component <{}, any>{ 

    render() {
        const expenseGraph: BudgetGraphProps = {
            transactions: ApplicationStore.transactions_raw,
            budget: 10000
        }
          
        return (
            <div className="">
                <BudgetGraph {...expenseGraph}></BudgetGraph>
            </div>
        );
    }
}
