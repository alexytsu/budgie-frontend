import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import moment = require("moment");
import { Line, ChartComponentProps, ChartData } from "react-chartjs-2";
import ApplicationStore from "../../../stores/ApplicationStore";
import apiHelpers from "../../../util/api-helpers";
import { hasListeners } from "mobx/lib/internal";

@observer
export default class BudgetOverTimeGraph extends Component<{}, {}> {
	render() {
		const transactions = ApplicationStore.transactions_raw
			.map(tr => apiHelpers.convertTransaction(tr))
			.sort((a, b) => moment(a.date).diff(b.date));

		type dayAmount = {
			date: moment.Moment;
			amount: number;
		};

		const initial: dayAmount[] = [];

		const dayByDayNetWorth: dayAmount[] = transactions.reduce((acc, tr) => {
			const len = acc.length;
			if (len === 0) {
				acc.push({
					date: moment(tr.date),
					amount: -tr.amount
				});
			} else if (acc[len - 1].date.isSame(moment(tr.date), "date")) {
				acc[len - 1].amount -= tr.amount;
			} else {
				acc.push({
					date: moment(tr.date),
					amount: acc[len - 1].amount - tr.amount
				});
			}
			return acc;
		}, initial);

		const dayByDayBudgeted = dayByDayNetWorth.map(da => {
			return ApplicationStore.getAmountBudgetdOn(da.date);
		});

		const dataSets: ChartData<any> = {
			labels: dayByDayNetWorth.map(da => da.date),
			datasets: [
				{
					label: "Budgeted",
					type: "line",
					data: dayByDayBudgeted,
					borderColor: "#974400",
					borderWidth: 1,
					cubicInterpolationMode: "monotone",
					pointRadius: 0,
				},
				{
					label: "Net Worth",
					type: "line",
					data: dayByDayNetWorth.map(da => da.amount),
					borderColor: "#004497",
					backgroundColor: "#eeffff",
					borderWidth: 1,
					cubicInterpolationMode: "monotone",
					pointRadius: 0,
				},
			]
		};

		const options = {
			scales: {
				xAxes: [
					{
						title: "time",
						type: "time"
					}
				]
			},
			tooltips: {
				enabled: false,
			},
		};

		const chartProps: ChartComponentProps = {
			data: dataSets,
			options
		};

		return <Line {...chartProps}></Line>;
	}
}
