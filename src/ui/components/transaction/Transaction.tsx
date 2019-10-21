import * as React from "react";
import { Component } from "react";
import * as classNames from "classnames";
import { TransactionDisplayProps, TransactionType } from "../../../util/types/TransactionTypes";

import "../../default.css";
import "./Transaction.css";

export default class Transaction extends Component<
	TransactionDisplayProps,
	{}
> {
	constructor(props) {
		super(props);
	}

	render() {

		const transactionClass = classNames({
			'transaction': true,
			'income': this.props.type === TransactionType.INCOME,
			'expense': this.props.type === TransactionType.EXPENSE,
		})

		return (
			<div className={transactionClass}>
				<div>
					<div className="amount">${this.props.amount}</div>
					<div className="account">{this.props.account}</div>
				</div>
				<div>
					<div className="category">{this.props.category}</div>
					<div className="description">{this.props.description}</div>
				</div>
			</div>
		);
	}
}
