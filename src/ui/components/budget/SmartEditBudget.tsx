import * as React from "react";
import { observer } from "mobx-react";
import {
	BudgetDisplayProps,
	BudgetPeriod
} from "../../../util/types/BudgetTypes";
import classNames = require("classnames");
import BudgetSceneStore from "../../../stores/BudgetSceneStore";
import apiHelpers from "../../../util/api-helpers";
import moment = require("moment");
import UserStore from "../../../stores/UserStore";
import { DateRangePicker } from "react-dates";
import ApplicationStore from "../../../stores/ApplicationStore";

export const SmartEditBudget = observer(
	(props: { budget_disp: BudgetDisplayProps }) => {
		const buttonColor = classNames({
			"text-green-600":
				BudgetSceneStore.newBudget.amount >= props.budget_disp.spent,
			"text-red-600":
				BudgetSceneStore.newBudget.amount < props.budget_disp.spent
		});

		const suggestionsFromPrevious = BudgetSceneStore.getSuggestions();
		const relevantPeriod = ApplicationStore.overbudgetedDays.filter(day => {
			return day.start_date.isBetween(
				moment(props.budget_disp.startDate),
				moment(props.budget_disp.endDate),
				"day",
				"[]"
			);
		});

		// if any of the overbudgeted periods lie in this budget
		const suggestionsCauseOverBudgetd =
			relevantPeriod.length <= 0 ? null : (
				<div className="flex">
					<div className="font-semibold pr-2 text-red-300">
						You have overallocated during this period by $
						{apiHelpers.round(
							relevantPeriod[0].budgeted - relevantPeriod[0].netWorth,
							2
						)}
					</div>
				</div>
			);

		return (
			<div className="my-2 bg-white shadow flex justify-between rounded">
				<div className="bg-blue-900 p-6 rounded-l">
					<h2 className="font-semibold text-white text-lg">Edit this budget</h2>
					<div className="text-blue-100">
						Begin editing values to see a live preview of your changes
					</div>
					{
						suggestionsCauseOverBudgetd
					}
					<div className="font-semibold text-blue-100 mt-2">
						Smart Suggestions
					</div>
					<div
						onClick={() => BudgetSceneStore.autobalance()}
						className="text-sm pr-2 text-blue-500 hover:font-bold cursor-pointer"
					>
						Predict Based on This Period
					</div>
					{props.budget_disp.period !== BudgetPeriod.PAST ? (
						<div className="flex">
							<div
								onClick={() =>
									(BudgetSceneStore.newBudget.amount =
										suggestionsFromPrevious.previousAmount)
								}
								className="text-sm pr-2 text-blue-500 hover:font-bold cursor-pointer"
							>
								Predict Based on History
							</div>
							<div className="text-white text-sm">
								Between{" "}
								{suggestionsFromPrevious.previousDateStart.format("DD MMM")} and{" "}
								{suggestionsFromPrevious.previousDateEnd.format("DD MMM")} you
								spent
							</div>
							<div className="pl-2 text-blue-500 text-sm">
								${apiHelpers.round(suggestionsFromPrevious.previousAmount, 2)}
							</div>
						</div>
					) : null}
				</div>
				<div className="p-6">
					<div>Amount</div>
					<div className="flex items-center mb-2">
						<div className="text-sm font-semibold text-gray-600 pr-2">$</div>
						<div className="bg-gray-200 rounded overflow-hidden flex items-center">
							<input
								id="newAmount"
								name="newAmount"
								className="bg-gray-200 p-2 w-full"
								type="number"
								value={BudgetSceneStore.newBudget.amount}
								onChange={e => {
									const newAmount = parseFloat(e.target.value);
									BudgetSceneStore.newBudget.amount = isNaN(newAmount)
										? undefined
										: apiHelpers.round(newAmount, 2);
								}}
							/>
						</div>
					</div>
					<div>Period</div>
					<DateRangePicker
						startDateId="newBudgetStartDate"
						startDate={moment(
							BudgetSceneStore.newBudget.startDate,
							"YYYY-MM-DD"
						)}
						endDateId="newBudgetEndDate"
						endDate={moment(BudgetSceneStore.newBudget.endDate, "YYYY-MM-DD")}
						focusedInput={BudgetSceneStore.newBudgetDatePickerFocus}
						onDatesChange={({ startDate, endDate }) => {
							BudgetSceneStore.newBudget.startDate = startDate.format(
								"YYYY-MM-DD"
							);
							BudgetSceneStore.newBudget.endDate = endDate.format("YYYY-MM-DD");
						}}
						onFocusChange={calendarFocus => {
							BudgetSceneStore.newBudgetDatePickerFocus = calendarFocus;
						}}
						isOutsideRange={() => false}
						numberOfMonths={2}
					/>
					<div className="flex mt-2 justify-between">
						<div
							onClick={() => BudgetSceneStore.deleteBudget(UserStore.token)}
							className="text-red-700 text-center text-sm font-semibold"
						>
							DELETE
						</div>
						<div
							onClick={() => BudgetSceneStore.updateBudget(UserStore.token)}
							className={buttonColor + " text-white text-sm font-semibold"}
						>
							SAVE
						</div>
					</div>
				</div>
			</div>
		);
	}
);
