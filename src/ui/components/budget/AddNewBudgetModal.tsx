import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import * as moment from "moment";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from "react-dates";

import { CreateBudgetReq } from "../../../util/types/BudgetTypes";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import { budgetScene } from "../../../test/Budget.stories";
import classNames = require("classnames");

interface AddBudgetState {
	amount: number;
	categoryId: number;
	endDate: moment.Moment;
	startDate: moment.Moment;
	error: boolean;
	showing: boolean;
	calendarFocused: "startDate" | "endDate" | null;
}

@observer
export default class AddNewBudgetModal extends Component<{}, AddBudgetState> {
	constructor(props) {
		super(props);

		this.state = {
			amount: 0,
			categoryId: 0,
			endDate: moment().add(1, "month"),
			startDate: moment(),
			error: false,
			showing: true,
			calendarFocused: null
		};
	}

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	handleDateChange = ({ startDate, endDate }) => {
		this.setState({ startDate, endDate });
	};

	handleFocusChange = calendarFocused => {
		this.setState({ calendarFocused });
	};

	handleSubmit = async () => {
		//TODO: handle bad data

		const budget: CreateBudgetReq = {
			amount: this.state.amount,
			category: this.state.categoryId,
			endDate: this.state.endDate.format("YYYY-MM-DD"),
			startDate: this.state.startDate.format("YYYY-MM-DD")
		};

		try {
			const resp = await ApplicationStore.createBudget(UserStore.token, budget);
		} catch(e) {
			this.setState({error: true});
		}

	};

	render() {

		const borderClassName = classNames({
			"w-full bg-white border-2 border-solid shadow-md rounded-lg p-4 border-indigo-200 mb-8": true,
			"border-indigo-200": !this.state.error,
			"border-red-500": this.state.error,
		})

		return (
			<div className={borderClassName}>
				<div className="text-gray-600">Category</div>
				<select
					className="p-2 my-2 rounded block"
					name="categoryId"
					value={this.state.categoryId}
					onChange={this.changeHandler}
				>
					{ApplicationStore.categories_raw.map(cat_raw => (
						<option key={cat_raw.id} value={cat_raw.id}>
							{cat_raw.name}
						</option>
					))}
				</select>
				<div className="text-gray-600 my-2">Spending Limit</div>
				<input
					name="amount"
					type="number"
					step="0.01"
					value={this.state.amount}
					onChange={this.changeHandler}
					className="rounded block my-2 p-2 font-semibold"
				/>
				<div className="text-gray-600 my-2">Budget Period</div>
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
					className="block p-2 rounded-lg shadow text-white my-4 font-bold bg-blue-600"
					onClick={async () => {
						await this.handleSubmit();
					}}
				>
					Submit
				</button>
			</div>
		);
	}
}
