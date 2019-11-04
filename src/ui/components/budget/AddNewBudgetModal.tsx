import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";

import * as moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import {
	DateRangePicker,
	SingleDatePicker,
	DayPickerRangeController
} from "react-dates";

import { CreateBudgetReq } from "../../../util/types/BudgetTypes";
import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import { budgetScene } from "../../../test/Budget.stories";

interface AddBudgetState {
	amount: number;
	categoryId: number;
	endDate: moment.Moment;
	startDate: moment.Moment;
	error: boolean;
	showing: boolean;
	calendarFocused: "startDate"|"endDate"|null;
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
			calendarFocused: null,
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

	handleFocusChange = (calendarFocused) => {
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

		const resp = await ApplicationStore.createBudget(UserStore.token, budget);
	};

	render() {
		return (
			<div id="modal container">
				<div className="text-md">Add a New Budget</div>
				<select
					name="categoryId"
					value={this.state.categoryId}
					onChange={this.changeHandler}
				>
					{ApplicationStore.categories_raw.map(cat_raw => (
						<option key={cat_raw.id} value={cat_raw.id}>{cat_raw.name}</option>
					))}
				</select>
				<input
					name="amount"
					value={this.state.amount}
					onChange={this.changeHandler}
					className="w-full"
				/>
				<div>Budget Period</div>
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
