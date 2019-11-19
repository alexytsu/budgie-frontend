import * as React from "react";
import { Component } from "react";
import { Line, Bar } from 'react-chartjs-2';
import Graph, { BudgetGraphProps } from "../graph/Graph";

import * as moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import { Month, DateRange } from '../graph/TimeType'
import { ExpenseGraph, IncomeGraph, BalanceGraph, CategoryGraph } from '../graph/GraphType'

import apiHelpers from "../../../util/api-helpers";
import UserStore from "../../../stores/UserStore";
import ApplicationStore from "../../../stores/ApplicationStore";
import Transaction from "../transaction/Transaction";
import { action } from "mobx";
import { observer } from "mobx-react";
import { number } from "prop-types";
import { TransactionListDateSections } from "../transaction/TransactionLists";

interface ViewAllCategoriesState {
	/*categories: any[];*/
	endDate: moment.Moment;
	startDate: moment.Moment;
	calendarFocused: "startDate" | "endDate" | null;
	timeline: DateRange;
}

@observer
export default class ViewAllCategories extends Component<
	{},
	ViewAllCategoriesState
> {
	constructor(props) {
		super(props);
		this.state = {
			endDate: moment(),
			startDate: moment().subtract(1, "week"),
			calendarFocused: null,
			timeline : new DateRange(moment().toDate(), moment().subtract(1, "week").toDate())
		};
	}

	@action
	select(id) {
		ApplicationStore.selectedCategoryId = parseInt(id.target.value);
	}

	edit() {
		//view category
	}

	delete = async () => {
		await ApplicationStore.deleteCategory(
			UserStore.token,
			ApplicationStore.selectedCategoryId
		);
	};

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	handleDateChange = ({ startDate, endDate }) => {
		
		if ((startDate === null) || (endDate === null)){
			return
		}

		this.setState({ startDate, endDate });
		this.setState({timeline: new DateRange(startDate._d, endDate._d)})
	};

	handleFocusChange = calendarFocused => {
		this.setState({ calendarFocused });
	};

	render() {
		return (
			<div className="flex justify-start">
				<div className="w-2/12 mt-10">
					<label
						className="font-sans text-3xl font-semibold text-gray-800 text-left"
						htmlFor="category"
					>
						Categories
					</label>
					<div style={{maxHeight: 600, maxWidth: 235}} className="overflow-y-scroll">
						{ApplicationStore.categories_raw.map(cat => {
							return (
								<div
											key={cat.id}
								>
									{cat.operation === "IN" ? (
										<button
											key={cat.id}
											value={cat.id}
											onClick={e => this.select(e)}
											className="bg-green-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded"
										>
											{cat.name}
										</button>
									) : (
										<button
											value={cat.id}
											onClick={e => this.select(e)}
											className="bg-orange-500 focus:bg-red-500 text-white mt-1 py-1 px-4 rounded"
										>
											{cat.name}
										</button>
									)}
								</div>
							);
						})}
					</div>
					<div>
						{ApplicationStore.selectedCategoryId === 0 ? null : (
							<div>
								<button
									className="whitespace-pre bg-teal-500 text-white mt-6 py-1 px-4 mr-4 rounded"
									onClick={() => this.edit()}
								>
									Edit
								</button>
								<button
									className="whitespace-pre bg-teal-500 text-white mt-6 py-1 px-4 rounded"
									onClick={() => this.delete()}
								>
									Delete
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="w-auto">
					{ApplicationStore.selectedCategoryId === 0 ? null : (
						<div>
							<div>
								<div className="text-gray-600 my-2">Expense Period</div>
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
							</div>
							<div style={{maxHeight: 600}} className="overflow-y-scroll">
							<TransactionListDateSections
								transactions={ApplicationStore.transactions_raw
									.filter(tr => { 
										return tr.category === ApplicationStore.selectedCategoryId;
									})
									.filter(tr => {
										return moment(tr.date).isBetween(
											this.state.startDate,
											this.state.endDate,
											"day",
											"[]"
										);
									})}
							/>
							</div>
						</div>
					)}
				</div>
				<div className="flex-1">
					{ApplicationStore.selectedCategoryId === 0 ? null : (
						<div>{
							<Bar data = {{
								labels: this.state.timeline.generateDatesToString(),
								datasets: [
									{
									label: "Transactions",
									fill: true,
									lineTension: 0.1,
									backgroundColor: 'red',
									borderColor: 'red',
									borderCapStyle: 'butt',
									borderDash: [],
									borderDashOffset: 0.0,
									borderJoinStyle: 'miter',
									pointBorderColor: 'rgba(75,192,192,1)',
									pointBackgroundColor: 'black',
									pointBorderWidth: 1,
									pointHoverRadius: 5,
									pointHoverBackgroundColor: 'rgba(75,192,192,1)',
									pointHoverBorderColor: 'rgba(220,220,220,1)',
									pointHoverBorderWidth: 2,
									pointRadius: 1,
									pointHitRadius: 10,
									data: this.state.timeline.generateData(ApplicationStore.transactions_raw
																			.filter(tr => { 
																				return tr.category === ApplicationStore.selectedCategoryId;
																			})
																			.filter(tr => {
																				return moment(tr.date).isBetween(
																					this.state.startDate,
																					this.state.endDate,
																					"day",
																					"[]"
																				);
																			}), new CategoryGraph, 0)
									}
								]	
							}}></Bar>
						}</div>
						)
					}
				</div>
			</div>
		);
	}
}
