import * as React from "react";
import { Component } from "react";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import {
	TransactionResp,
	TransactionDisplayProps
} from "../../../util/types/TransactionTypes";

import "../../styles.css";
import ApplicationStore from "../../../stores/ApplicationStore";
import UserStore from "../../../stores/UserStore";
import moment = require("moment");
import { observer } from "mobx-react";
import apiHelpers from "../../../util/api-helpers";
import Transaction from "./Transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AccountSceneStore from "../../../stores/AccountSceneStore";

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
			if (AccountSceneStore.loading == true) {
				return <h1 className="text-lg text-center my-6 text-gray-500">LOADING TRANSACTIONS...</h1>
			} else {
				return <div className="text-lg text-center my-6 text-gray-500">Empty</div>;
			}
			
		}

		const transactions = this.props.transactions
			.sort((a, b) => moment(b.date).diff(a.date))
			.map(tr_raw => apiHelpers.convertTransaction(tr_raw));

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
			<div className="font-semibold w-full text-gray-700 py-2">{date.format("DD MMM YYYY")}</div>
			{props.transactions.map(tr => {
				return (
					<div key={tr.id}>
						<Transaction {...tr}></Transaction>
						{tr.id === ApplicationStore.selectedTransactionId ? (
							<div className="flex justify-end" >
								<button
								className="m-1 text-blue-400 p-1 px-2 text-xs"
									onClick={() => {
										ApplicationStore.clearSelectedTransaction();
									}}
								>
									Clear
								</button>
								<button
								className="m-1 bg-red-600 text-white p-1 px-2 text-xs"
									onClick={() => {
										ApplicationStore.deleteSelectedTransaction(UserStore.token);
									}}
								>
								<FontAwesomeIcon icon={faTrashAlt} className="mr-1 self-center"/>
									Delete
								</button>
							</div>
						) : null}
					</div>
				);
			})}
		</>
	);
});
