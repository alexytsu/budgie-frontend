import * as React from "react";
import { Component } from "react";
import classNames from "classnames";
import moment = require("moment");

import {
	BudgetDisplayProps,
	BudgetPeriod
} from "../../../util/types/BudgetTypes";
import "../../tailwind.css";

export default class extends Component<BudgetDisplayProps, {}> {
	render() {
		const { category, spent, startDate, endDate } = this.props;

		let { limit } = this.props;

		if (limit === undefined) {
			limit = 0;
		}

		const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
		const today = new Date();

		const dateOptions: Intl.DateTimeFormatOptions = {
			day: "numeric",
			month: "short"
		};

		let dateProgress =
			((today.getTime() - startDate.getTime()) /
				(endDate.getTime() - startDate.getTime())) *
			100;

		dateProgress = Math.min(dateProgress, 100);

		let spendingProgress = (spent * 100) / limit;

		const spendingAheadOfSchedule = spendingProgress > dateProgress;
		const spendingExceededLimit = spent > limit;

		const current = this.props.period === BudgetPeriod.CURRENT;

		const dateProgressStyle = classNames({
			"h-full border-green-600 border-solid rounded-lg bg-green-100":
				!spendingAheadOfSchedule && current,
			"h-full border-red-700 border-solid border-t-2 border-l-2 border-b-2 rounded-lg rounded-r-none bg-green-600 absolute":
				spendingAheadOfSchedule && current,
			"h-full border-blue-600 border-solid border-2 rounded-lg bg-blue-100":
				this.props.period === BudgetPeriod.PAST
		});

		const spendingProgressStyle = classNames({
			"h-full bg-green-600 overflow-visible absolute rounded-l-lg":
				!spendingAheadOfSchedule && !spendingExceededLimit && current,
			"h-full bg-red-300 border-solid border-2 border-red-700 rounded-l-lg absolute overflow-visible":
				spendingAheadOfSchedule && !spendingExceededLimit && current,
			"h-full bg-blue-600 overflow-visible absolute rounded-l-lg":
				this.props.period === BudgetPeriod.PAST
		});

		const budgetStyle = classNames({
			"rounded-lg shadow relative h-10 flex overflow-hidden": true,
			"shadow-lg border": this.props.selected,
			"m-2": !this.props.selected,
			"bg-white": current,
			"bg-red-200 py-2": spendingExceededLimit,
			"bg-yellow-200": this.props.period === BudgetPeriod.FUTURE
		});

		let bar = (
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
		);

		if (spendingExceededLimit) {
			bar = (
				<div className="w-full flex justify-between px-2">
					{spendingExceededLimit ? (
						<div className="font-bold text-red-800">Underfunded</div>
					) : null}{" "}
					{spendingExceededLimit ? (
						<button className="text-blue-800">Fix</button>
					) : null}
				</div>
			);
		}

		return (
			<div className="w-full">
				<div className="text-xs font-bold object-right text-right">
					${limit}
				</div>
				<div className={budgetStyle}>{bar}</div>
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
