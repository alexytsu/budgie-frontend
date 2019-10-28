import * as React from "react";
import { Component } from "react";
import { Line } from 'react-chartjs-2';
import ApplicationStore from '../../../stores/ApplicationStore';
import UserStore from '../../../stores/UserStore';

import apiHelpers from "../../../util/api-helpers";

export default class BudgetGraph extends Component<{}, any> {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            stateData: [19,5,21,35,26,49,4],
            labels: [1,2,3,4,5,6,7]
        }
    }

    async componentDidMount() {
        await apiHelpers.loginUser("joe", "password");
        const response = await apiHelpers.getAllTransactions(UserStore.token);
        
    }

    render() {
        const {stateData, labels} = this.state;
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
            </div>
        );
    }

}