import * as React from "react";
import { Component } from "react";
import { Line } from 'react-chartjs-2';

import {TransactionDisplayProps, TransactionResp } from "../../../util/types/TransactionTypes";
import ApplicationStore from "../../../stores/ApplicationStore";
import { observer } from "mobx-react";


export interface BudgetGraphProps {
    transactions: TransactionResp[];
}

@observer
export default class BudgetGraph extends Component< BudgetGraphProps, any> {

    constructor(props) {
        super(props)
        this.state = {
            name: "Graph",
            stateData: [],
            labels: []
        }
    }

    componentDidMount() {
        const transactions = this.props.transactions
        const data = []
        const dates = []

        transactions.map((trans)=> {
            data.push(trans.amount)
            dates.push(trans.date)
        })
        
        this.setState({stateData: data})
        this.setState({labels: dates})
    }

    rendertimeline(type) {
        if (type === "week") {
            const newDates = []
            this.props.transactions.map((trans) => {
                newDates.push(trans.date)
            })
            
            // Some magic happens here

            this.setState({stateData: newDates})
            console.log("week")
        } else if (type === "month") {
            console.log("month")
        } else {
            console.log('hi')
        }
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
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'red',
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
                    <div className="inline-block relative w-64">
                        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                            this.rendertimeline(e.target.value)
                        }}>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
            </div>
        );
    }

}