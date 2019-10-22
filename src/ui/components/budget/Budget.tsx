import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import { BudgetDisplayProps } from "../../../util/types/BudgetTypes";
import "../../tailwind.css";

export default class extends Component<BudgetDisplayProps, {}> {
	render() {
		const { category, limit, spent, startDate, endDate } = this.props;
		const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
		const today = new Date();

		const dateOptions: Intl.DateTimeFormatOptions = {
			day: "numeric",
			month: "short"
		};

		const dateProgress =
			((today.getTime() - startDate.getTime()) /
				(endDate.getTime() - startDate.getTime())) *
			100;


		const spendingProgress = (spent * 100 / limit);
		const overspent = spendingProgress > dateProgress;


		const dateProgressStyle = classNames({
			'h-full border-green-600 border-solid border-2 rounded-lg bg-green-100': !overspent,
			'h-full border-red-700 border-solid border-t-2 border-l-2 border-b-2 rounded-lg rounded-r-none bg-green-600 absolute': overspent,
		})

		const spendingProgressStyle = classNames({
			'h-full bg-green-600 overflow-visible absolute rounded-l-lg': !overspent,
			'h-full bg-red-300 border-solid border-2 border-red-700 rounded-lg absolute overflow-visible': overspent,
		})

		return (
			<div className="w-full px-4">
				<div className="text-xs font-bold object-right text-right">${limit}</div>
				<div className="rounded-lg shadow-lg relative h-10">
					<div style={{ width: spendingProgress + "%"}} className={spendingProgressStyle} />
					<div style={{ width: dateProgress + "%" }} className={dateProgressStyle}></div>
				</div>
				<div className="flex flex-row justify-between">
				<div className="mt-2 text-xs font-bold">
						{startDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
				<div className="mt-2 text-xs font-bold">
						{midDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
				<div className="mt-2 text-xs font-bold">
						{endDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
				</div>
			</div>
		);
	}
}
