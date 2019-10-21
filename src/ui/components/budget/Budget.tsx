import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import "./Budget.css";
import "../../styles.css";
import { BudgetDisplayProps } from "../../../util/types/BudgetTypes";

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
			'date-progress-underspent': !overspent,
			'date-progress-overspent': overspent,
		})

		const spendingProgressStyle = classNames({
			'spending-progress-underspent': !overspent,
			'spending-progress-overspent': overspent,
		})

		return (
			<div className="budget">
				<div className="money-section">
					<div style={{width: spendingProgress + "%"}}></div>
					<div className="money-label-container">
						<div className="money-label"><p className="dollar-sign">$</p><p>{spent}</p></div>
						<div className="money-label"><p className="dollar-sign">$</p><p>{limit}</p></div>
					</div>
				</div>
				<div className="progress-bar">
					<div style={{ width: spendingProgress + "%"}} className={spendingProgressStyle} />
					<div style={{ width: dateProgress + "%" }} className={dateProgressStyle}></div>
				</div>
				<div className="date-section">
					<div className="date">
						{startDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
					<div className="date">
						{midDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
					<div className="date">
						{endDate.toLocaleDateString("en-AU", dateOptions).toUpperCase()}
					</div>
				</div>
			</div>
		);
	}
}
