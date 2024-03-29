import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import {
	TransactionDisplayProps,
	TransactionType
} from "../../../util/types/TransactionTypes";

import { observer } from "mobx-react";
import ApplicationStore from "../../../stores/ApplicationStore";
import moment = require("moment");
import { faSortNumericDown } from "@fortawesome/free-solid-svg-icons";

@observer
export default class Transaction extends Component<
	TransactionDisplayProps,
	{}
> {
	constructor(props) {
		super(props);
	}

	render() {

		const selected = this.props.id === ApplicationStore.selectedTransactionId;

		const transactionClass = classNames({
			"bg-white border-l-4 border-solid p-1 px-2 flex flex-row justify-between shadow": true,
			"border-green-600 bg-green-100":
				this.props.type === TransactionType.INCOME && !selected,
			"border-red-600": this.props.type === TransactionType.EXPENSE && !selected,
			"bg-blue-200 border-blue-600": selected,
		});

		const category = ApplicationStore.categories_raw.find(
			cat_raw => cat_raw.id === this.props.category
		);
		const categoryName = category === undefined ? "" : category.name;

		return (
			<div
				onClick={() => {
					ApplicationStore.selectedTransactionId = this.props.id;
				}}
				className={transactionClass}
			>
				<div>
					<div className="font-bold text-black text-xs text-left">{categoryName}</div>
					<div className="font-semibold text-gray-900 text-xs text-left">
						{moment(this.props.date).format("DD MMM YY")}
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div style={{fontVariantNumeric: "tabular-nums"}} className="align-middle font-bold text-sm text-black">
						${Math.abs(this.props.amount).toFixed(2)}
					</div>
				</div>
			</div>
		);
	}
}
