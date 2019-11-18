import * as React from "react";
import { Component } from "react";
import { Pie } from 'react-chartjs-2';
import { TransactionResp } from "../../../util/types/TransactionTypes";
import { CategoryResp } from "../../../util/types/CategoryTypes";
import { observer } from "mobx-react";

export interface AccountChartProps {
    key: string;
    transactions: TransactionResp[];
    categories: CategoryResp[];
}

@observer
export default class PieChart extends Component<AccountChartProps, any> {
    constructor(props) {
        super(props)
        this.state = {
            transactions: this.props.transactions,
            categories: this.props.categories,
            data: [],
            
            backgroundColor: [],   
            labels: []
        }
    }

    componentDidMount() {
        let data = []
        let label = []
        let color = []

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
            if (dict[key] < 0) {
                color.push("#008000")
                data.push(0 - dict[key].toFixed(2))
            } else {
                color.push("#800000")
                data.push(dict[key].toFixed(2))
            }
            
        }
    
        this.addvalues(data, label, color)
    }

    addvalues(data, label, color) {
        this.setState({data: data})
        this.setState({labels: label})
        this.setState({backgroundColor: color})
    }

    render() {
        return(
            <div key={this.props.key}>
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