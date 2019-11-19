import * as React from "react";
import { Line, Bar } from 'react-chartjs-2';
import { TransactionType } from "../../../util/types/TransactionTypes";
import { filter } from "minimatch";



interface GraphType {
    generateData(trans, budget)
    isBalance()
    render(labels, data)
}

export class ExpenseGraph implements GraphType {
    generateData(trans) {
        if (trans.amount > 0) {
            return Number(trans.amount)
        } else {
            return 0
        }
    }
    isBalance() {
        return false
    }
    render(labels, data) {
        return (
            <Bar data = {{
                labels: labels,
                datasets: [
                    {
                    label: "Expenses",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'red',
                    borderColor: 'red',
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
                    data: data
                    
                    }
                ]
            }} ></Bar>
        )
    }
}   

export class IncomeGraph implements GraphType {
    generateData(trans) {
        if (trans.amount < 0) {
            return 0 - Number(trans.amount)
        } else {
            return 0
        }
    }
    isBalance() {
        return false
    }
    render(labels, data) {
        return (
            <Bar data = {{
                labels: labels,
                datasets: [
                    {
                    label: "Income",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'green',
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
                    data: data
                    }
                ]
            }} ></Bar>
        )
    }
}   

export class BalanceGraph implements GraphType {

    generateData(trans) {
        if (trans.amount > 0) {
            return Number(trans.amount)
        } else {
            return (Number(trans.amount))
        }
    }
    isBalance() {
        return true
    }
    calculateBalance(transactions, datesArr, budget) {
        let data = []
        let start = datesArr[0]
        let end = datesArr[datesArr.length -1]
        let filteredTrans = []
        let beforesum = 0

        transactions.map((trans) => {
            if (new Date(trans.date) < start) { 
                beforesum += trans.amount
            } else if (new Date(trans.date) > start && new Date(trans.date) < end) {
                filteredTrans.push(trans)
            }
        })

        let startingBuget = budget - beforesum
        datesArr.map((days) => {
            let budgetLeft = startingBuget
            filteredTrans.map((trans) => {
                let tmp = 0

                if (datesArr.length === 12) {
                    if (
                    new Date(trans.date).getMonth() === days.getMonth() &&
                    new Date(trans.date).getFullYear() === days.getFullYear()){
                        tmp += Number(this.generateData(trans))
                    }
                } else {
                    if (
                    new Date(trans.date).getDate() === days.getDate() &&
                    new Date(trans.date).getMonth() === days.getMonth() &&
                    new Date(trans.date).getFullYear() === days.getFullYear()){
                        tmp += Number(this.generateData(trans))
                    }
                }
                
                budgetLeft = budgetLeft -tmp
                startingBuget = budgetLeft
            })
            data.push(budgetLeft)
        })


        return data
    }
    render(labels, data) {
        return (
            <Line data = {{
                labels: labels,
                datasets: [
                    {
                    label: "Balance",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,1)',
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
                    data: data,
                    }
                ],
            }} 
            options= {{
                scales:{
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }} ></Line>
        )
    }
}

export class CategoryGraph implements GraphType {
    generateData(trans) {
        return Number(trans.amount)
    }
    isBalance() {
        return false
    }
    render(labels, data) {
        return (
            <Bar data = {{
                labels: labels,
                datasets: [
                    {
                    label: "Income",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'green',
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
                    data: data
                    }
                ]
            }} ></Bar>
        )
    }
} 