import * as React from "react";
import { Component } from "react";
import { Line } from 'react-chartjs-2';

import { TransactionResp, TransactionType } from "../../../util/types/TransactionTypes";
import { observer } from "mobx-react";


export interface BudgetGraphProps {
    transactions: TransactionResp[];
}

@observer
export default class BudgetGraph extends Component< BudgetGraphProps, any> {

    constructor(props) {
        super(props)
        this.state = {
            filteredTransactions: [],
            budget: 1000,
            name: "Graph",
            stateData: [],
            labels: []
        }
    }

    componentDidMount() {
        this.rendertimeline("all")
    }

    rendertimeline(type) {
        if (type === "week") {
            const filteredTransactions = []
            
            // Some magic happens here
            let [start, end] = this.findWeek()
            // let start = new Date("2019-10-2")
            // let end = new Date("2019-10-7")

            console.log(start)
            console.log(end)
            let sum = 0;
            this.props.transactions.map((trans) => {
                if (new Date(trans.date) < end && new Date(trans.date) > start) {
                    console.log("hi")
                    filteredTransactions.push(trans)
                } else if (new Date(trans.date) < start) {
                    sum += trans.amount
                }
            })
            console.log(filteredTransactions)

            this.setValues(filteredTransactions, sum)

        } else if (type === "month") {
            console.log("month")
            const filteredTransactions = []
            
            // Some magic happens here
            let [start, end] = this.findMonth()
            // let start = new Date("2019-10-2")
            // let end = new Date("2019-10-7")

            console.log(start)
            console.log(end)
            let sum = 0;
            this.props.transactions.map((trans) => {
                if (new Date(trans.date) < end && new Date(trans.date) > start) {
                    console.log("hi")
                    filteredTransactions.push(trans)
                } else if (new Date(trans.date) < start) {
                    sum += trans.amount
                }
            })
            console.log(filteredTransactions)

            this.setValues(filteredTransactions, sum)
            
        } else {
            console.log('hi')
            const filteredTransactions = []
            
            let sum = 0;
            this.props.transactions.map((trans) => {   
                filteredTransactions.push(trans)
            })
            console.log(filteredTransactions)

            this.setValues(filteredTransactions, sum)

        }
    }

    findWeek() {
        let now = new Date()
        let day = now.getDay()
        let date = now.getDate()

        let start = new Date(now)
        start.setDate(date - day)
        start.setHours(0, 0, 0, 0)

        let end = new Date()
        end.setDate(date + (6 - day))
        start.setHours(0, 0, 0, 0)

        return [start, end]
    }

    findMonth() {
        let now = new Date()
        let start = new Date(now.getFullYear(), now.getMonth(), 1)
        let end = new Date(now.getFullYear(), now .getMonth() + 1, 0)

        return [start, end]
    }

    setValues(transactions, sum) {
        const data = [this.state.budget - sum]
        const dates = ['']
        let tmpbudget = this.state.budget
        transactions.map((trans)=> {
            tmpbudget = tmpbudget - sum
            let amount = tmpbudget
            if (trans.operation === TransactionType.EXPENSE) {
                amount -= Number(trans.amount)
            } else if (trans.operation === TransactionType.INCOME) {
                amount += Number(trans.amount)
            }
            
            tmpbudget = amount
            data.push(amount)
            dates.push(trans.date)
        })
        
        this.setState({stateData: data})
        this.setState({labels: dates})
    }

    render() {
        const {stateData, labels, name} = this.state;
        return (
            <div>
                <Line data = {{
                        labels: labels,
                        datasets: [
                            {
                            label: name,
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(0,128,0,0.6)',
                            borderColor: 'green',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: 'black',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: stateData
                            }
                        ]
                    }} ></Line>
                    <div className="inline-block relative w-64 ml-10">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                            this.rendertimeline(e.target.value)
                        }}>
                            <option value="all">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    <div className="inline-block relative w-64 ml-10">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                            this.rendertimeline(e.target.value)
                        }}>
                            <option value="expense">Expense</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
            </div>
        );
    }

}