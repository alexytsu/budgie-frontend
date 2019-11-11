import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import apiHelpers from "../../util/api-helpers";
import ApplicationStore from "../../stores/ApplicationStore";
import Transaction from "../components/transaction/Transaction";
import TransactionForm from "../components/transaction/TransactionForm";
import moment = require("moment");
import { number } from "prop-types";
import { triggerAsyncId } from "async_hooks";
import UserStore from "../../stores/UserStore";
import { TransactionListDateSections } from "../components/transaction/TransactionLists";
import { DateRangePicker } from "react-dates";
import classNames = require("classnames");

interface LedgerSceneState {
	selectedTransactionId: number;
	endDate: moment.Moment;
	startDate: moment.Moment;
	error: boolean;
	showing: boolean;
	calendarFocused: "startDate" | "endDate" | null;
	filteringDate: boolean;
}

@observer
export default class LedgerScene extends Component<{}, LedgerSceneState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedTransactionId: 0,
			calendarFocused: null,
			showing: true,
			error: false,
			endDate: moment(),
			startDate: moment().subtract(1, "year"),
			filteringDate: false
		};
	}

	handleDateChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });
	};

	handleFocusChange = calendarFocused => {
		this.setState({ calendarFocused });
	};

	render() {
		const filterButtonStyle = classNames({
			"px-4 my-1 rounded-lg shadow font-semibold mx-auto": true,
			"bg-green-100": !this.state.filteringDate,
			"bg-red-100": this.state.filteringDate
		});

		let shownTransactions = ApplicationStore.transactions_raw;

		if (this.state.filteringDate) {
			shownTransactions = ApplicationStore.transactions_raw.filter(tr =>
				moment(tr.date, "YYYY-MM-DD").isBetween(
					this.state.startDate,
					this.state.endDate,
					"date",
					"[]"
				)
			);
		}

		return (
			<div className="flex h-full pb-4">
				<div className="w-full h-full flex flex-col overflow-y-scroll mr-4 rounded-lg px-2">
					<div className="flex">
						<DateRangePicker
							startDate={this.state.startDate}
							startDateId="startDate"
							endDate={this.state.endDate}
							endDateId="endDate"
							onDatesChange={this.handleDateChange}
							focusedInput={this.state.calendarFocused}
							onFocusChange={this.handleFocusChange}
							isOutsideRange={() => false}
							numberOfMonths={2}
						></DateRangePicker>
						<button
							onClick={() => {
								this.setState((prevState, props) => {
									return { filteringDate: !prevState.filteringDate };
								});
							}}
							className={filterButtonStyle}
						>
							Filter
						</button>
					</div>
					<TransactionListDateSections
						transactions={shownTransactions}
					></TransactionListDateSections>
				</div>
				<div className="w-full ml-4">
					<h1 className="text-xl">New Transaction</h1>
					<TransactionForm></TransactionForm>
				</div>
			</div>
		);
	}
}
