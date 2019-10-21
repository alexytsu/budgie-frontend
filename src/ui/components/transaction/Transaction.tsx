import * as React from "react";
import { Component } from "react";
import { TransactionDisplayProps } from "../../../util/types/TransactionTypes";

import "./Transaction.css";

export default class Transaction extends Component<
	TransactionDisplayProps,
	{}
> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="transaction">
				<div>
					<div>${this.props.amount}</div>
					<div>{this.props.account}</div>
				</div>
				<div>
					<div>{this.props.category}</div>
					<div>{this.props.description}</div>
				</div>
			</div>
		);
	}
}
