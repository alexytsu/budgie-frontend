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
			startDate: moment().startOf("month"),
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
			"px-4 py-2 rounded-lg shadow font-semibold mx-auto": true,
			"bg-indigo-100": !this.state.filteringDate,
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
				<div className="pr-5 w-full">
					<div className="flex-auto bg-gray-900 p-1 h-20 text-white font-bold rounded-lg">
						<h1 className="ml-2 text-lg">HOME</h1>
						<h1 className="ml-2">{UserStore.username}</h1>
					</div>
					<div className="mt-5">
						<TransactionForm></TransactionForm>
					</div>
				</div>
				
				<div className="flex flex-col w-full h-full">
					<div className="flex justify-between">
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
						<div>
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
					</div>
					<div className="w-full h-full flex flex-col overflow-y-scroll mt-4 mr-4 rounded-lg px-4 bg-white">
						<TransactionListDateSections
							transactions={shownTransactions}
						></TransactionListDateSections>
					</div>
				</div>
				
			</div>
		);
	}
}
