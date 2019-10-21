import * as React from "react";
import { Component } from "react";
import * classNames from "classnames";

import "./Budget.css";
import { BudgetDisplayProps } from "../../../util/types/BudgetTypes";

export default class extends Component<BudgetDisplayProps, {}> {
	render() {
		const { limit, spent, startDate, endDate } = this.props;
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

    const spendingProgress = (spent / limit) * 100;
    const overspent = spendingProgress > dateProgress;


    const dateProgressStyle = classNames({
      'date-progress-underspend': !overspent,
      'date-progress-overspent': overspent,
    })

    const spendingProgressStyle = classNames({
      'spending-progress-underspend': !overspent,
      'spending-progress-overspent': overspent,
    })

		return (
			<div className="budget">
				<div className="date-section">
					<div className="date">
						{startDate.toLocaleDateString("en-AU", dateOptions)}
					</div>
					<div className="date">
						{midDate.toLocaleDateString("en-AU", dateOptions)}
					</div>
					<div className="date">
						{endDate.toLocaleDateString("en-AU", dateOptions)}
					</div>
				</div>
				<div className="progress-bar">
          <div style={{ width: spendingProgress + "%"}} className={spendingProgressStyle}/>
					<div style={{ width: dateProgress + "%" }} className={dateProgressStyle}></div>
				</div>
			</div>
		);
	}
}
