import * as React from "react";
import { Component } from "react";
import { ExpenseGraph, IncomeGraph, BalanceGraph } from './GraphType'
import { Week, Month, Year } from './TimeType'

import { TransactionResp } from "../../../util/types/TransactionTypes";
import { observer } from "mobx-react";

export interface BudgetGraphProps {
    transactions: TransactionResp[];
    budget: number;
}

@observer
export default class Graph extends Component< BudgetGraphProps, any> {

    constructor(props) {
        super(props)
        this.state = {
            transactions: this.props.transactions,
            budget: this.props.budget,
            graphtype: new BalanceGraph(),
            timeline: new Week()
        }
    }

    setTimelineStrategy(type) {
        if (type === "week") {
            this.setState({timeline: new Week()})
        } else if (type === "month") {
            this.setState({timeline: new Month()})
        } else if (type === "year") {
            this.setState({timeline: new Year()})

        }
    }

    setGraphStrategy(type) {
        if (type === "expense") {
            this.setState({graphtype: new ExpenseGraph()})
        } else if (type === "income") {
            this.setState({graphtype: new IncomeGraph()})
        } else if (type === "balance") {
            this.setState({graphtype: new BalanceGraph()})
        }
    }

    render() {
        const {timeline, graphtype, transactions, budget} = this.state;
        return (
            <div>
                {graphtype.render(timeline.generateDatesToString(), timeline.generateData(transactions, graphtype, budget))}
                
                <div className="inline-block relative w-64 ml-10">
                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => {
                        this.setTimelineStrategy(e.target.value)
                    }}>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                <div className="inline-block relative w-64 ml-20">
                    <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => {
                        this.setGraphStrategy(e.target.value)
                    }}>
                        <option value="balance">Balance</option>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        );
    }

}


