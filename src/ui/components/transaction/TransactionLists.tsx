import * as React from "react";
import { Component } from "react";
import classNames from "classnames";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker } from "react-dates";

import {
	TransactionResp,
	TransactionDisplayProps
} from "../../../util/types/TransactionTypes";

import "../../styles.css";
import "../../tailwind.css";
import ApplicationStore from "../../../stores/ApplicationStore";
import UserStore from "../../../stores/UserStore";
import moment = require("moment");
import { observer } from "mobx-react";
import apiHelpers from "../../../util/api-helpers";
import Transaction from "./Transaction";

interface TransactionListProps {
	transactions: TransactionResp[];
}

@observer
export class TransactionListDateSections extends Component<
	TransactionListProps,
	{}
> {
	render() {
		if (this.props.transactions.length == 0) {
			return <div className="font-bold text-lg">Empty</div>;
		}

		const transactions = this.props.transactions
			.sort((a, b) => moment(b.date).diff(a.date))
			.map(tr_raw => apiHelpers.convertTransaction(tr_raw));

		console.log(transactions[0]);

		const sections: TransactionDisplayProps[][] = [];
		let currentSection: TransactionDisplayProps[] = [];
		let currentDate = null;

		transactions.forEach(tr => {
			if (currentSection.length == 0) {
				currentSection.push(tr);
				currentDate = moment(tr.date);
				return;
			}

			const newDate = moment(tr.date);
			if (newDate.isSame(currentDate, "date")) {
				currentSection.push(tr);
			} else {
				sections.push(currentSection);
				currentSection = [tr];
				currentDate = newDate;
			}
		});

		sections.push(currentSection);

		return (
			<>
				{sections.map(tr_group => {
					return (
						<TransactionDateGroup
							key={tr_group[0].id}
							transactions={tr_group}
						></TransactionDateGroup>
					);
				})}
			</>
		);
	}
}

const TransactionDateGroup = observer((props: {
	transactions: TransactionDisplayProps[];
}) => {
	const date = moment(props.transactions[0].date);
	return (
		<>
			<div className="font-bold my-2">{date.format("DD MMM YYYY")}</div>
			{props.transactions.map(tr => {
				return (
					<div key={tr.id}>
						<Transaction {...tr}></Transaction>
						{tr.id === ApplicationStore.selectedTransactionId ? (
							<>
								<button
								className="m-1 bg-red-600 text-white rounded p-1 text-xs"
									onClick={() => {
										ApplicationStore.deleteSelectedTransaction(UserStore.token);
									}}
								>
									Delete
								</button>
								<button
								className="m-1 mt-2 bg-teal-600 text-white rounded p-1 text-xs"
									onClick={() => {
										ApplicationStore.clearSelectedTransaction();
									}}
								>
									Clear
								</button>
							</>
						) : null}
					</div>
				);
			})}
		</>
	);
});
