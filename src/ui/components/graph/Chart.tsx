import * as React from "react";
import { Component } from "react";
import { Pie } from 'react-chartjs-2';
import { TransactionResp } from "../../../util/types/TransactionTypes";
import { CategoryResp } from "../../../util/types/CategoryTypes";

export interface AccountChartProps {
    transactions: TransactionResp[];
    categories: CategoryResp[];
}

export default class PieChart extends Component<AccountChartProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            transactions: this.props.transactions,
            categories: this.props.categories,
            data: [],
            // TODO dynamic coloring
            backgroundColor: ['red', 'blue', 'green', 'yellow'],   
            labels: []
        }
    }

    componentDidMount() {
        let data = []
        let label = []

        let dict = {}
        this.state.transactions.map((trans) => {   
            this.state.categories.map((cat) => {
                if (cat.id === trans.category) {
                    if (cat.name in dict) {
                        dict[cat.name] = (dict[cat.name] + trans.amount)
                    } else {
                        dict[cat.name] = trans.amount
                    }
                }
            })
        })
        for (var key in dict) {
            label.push(String(key))
            data.push(dict[key].toFixed(2))
        }
     
        this.addvalues(data, label)
    }

    addvalues(data, label) {
        this.setState({data: data})
        this.setState({labels: label})
    }

    render() {
        return(
            <div>
                <Pie
                    data={{
                        labels: this.state.labels,
                        datasets: [{
                            data: this.state.data,
                            backgroundColor: this.state.backgroundColor
                        }],
                        width: 50
                        
                    }}
                ></Pie>
            </div>
        )
    }
}