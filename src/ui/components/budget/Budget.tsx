import * as React from "react";
import { Component } from "react";
import classNames from "classnames";
import moment = require("moment");

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

		const spendingProgress = (spent * 100) / limit;
		const overspent = spendingProgress > dateProgress;
		const underBudgeted = spent > limit;

		const validDate = moment().isBetween(
			moment(startDate),
			moment(endDate),
			"day",
			"[]"
		);
		const valid = !underBudgeted && validDate;

		const dateProgressStyle = classNames({
			"h-full border-green-600 border-solid border-2 rounded-lg bg-green-100":
				!overspent && valid,
			"h-full border-red-700 border-solid border-t-2 border-l-2 border-b-2 rounded-lg rounded-r-none bg-green-600 absolute":
				overspent && valid
		});

		const spendingProgressStyle = classNames({
			"h-full bg-green-600 overflow-visible absolute rounded-l-lg":
				!overspent && valid,
			"h-full bg-red-300 border-solid border-2 border-red-700 rounded-lg absolute overflow-visible":
				overspent && valid
		});

		const budgetStyle = classNames({
			"rounded-lg shadow relative h-10 flex": true,
			"shadow-lg border": this.props.selected,
			"m-2": !this.props.selected,
			"bg-white": valid,
			"bg-red-200 py-2": underBudgeted,
			"bg-yellow-200": !validDate
		});

		return (
			<div className="w-full">
				<div className="text-xs font-bold object-right text-right">
					${limit}
				</div>
				<div className={budgetStyle}>
					{valid ? (
						<>
							<div
								style={{ width: spendingProgress + "%" }}
								className={spendingProgressStyle}
							/>
							<div
								style={{ width: dateProgress + "%" }}
								className={dateProgressStyle}
							></div>
						</>
					) : (
						<div className="w-full flex justify-between px-2">
							{underBudgeted ? (
								<div className="font-bold text-red-800">Underfunded</div>
							) : null}{" "}
							{underBudgeted ? (
								<button className="text-blue-800">Fix</button>
							) : null}
						</div>
					)}
				</div>
				<div className="flex flex-row justify-between">
					<div className="mt-2 text-xs">
						{startDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
					<div className="mt-2 text-xs">
						{midDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
					<div className="mt-2 text-xs">
						{endDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
				</div>
			</div>
		);
	}
}
