import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import { TransactionDisplayProps, TransactionType } from "../../../util/types/TransactionTypes";

import "../../tailwind.css";

export default class Transaction extends Component<
	TransactionDisplayProps,
	{}
> {
	constructor(props) {
		super(props);
	}

	render() {

		const transactionClass = classNames({
			'border-l-4 border-solid rounded-lg p-2 flex flex-row justify-between shadow-lg': true,
			'border-green-600': this.props.type === TransactionType.INCOME,
			'border-red-600': this.props.type === TransactionType.EXPENSE,
		})

		return (
			<div className={transactionClass}>
				<div>
					<div className="font-bold text-xs text-black">${this.props.amount}</div>
					<div className="font-semibold text-xs text-gray-900">{this.props.account}</div>
				</div>
				<div>
					<div className="font-bold text-black text-xs">{this.props.category}</div>
					<div className="font-semibold text-gray-900 text-xs">{this.props.description}</div>
				</div>
			</div>
		);
	}
}
