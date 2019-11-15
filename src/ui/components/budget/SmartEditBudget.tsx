import * as React from "react";
import { observer } from "mobx-react";
import { BudgetDisplayProps } from "../../../util/types/BudgetTypes";
import classNames = require("classnames");
import BudgetSceneStore from "../../../stores/BudgetSceneStore";
import apiHelpers from "../../../util/api-helpers";
import moment = require("moment");
import UserStore from "../../../stores/UserStore";
import {DateRangePicker} from "react-dates";

export const SmartEditBudget = observer((props: { budget_disp: BudgetDisplayProps }) => {
	const buttonColor = classNames({
		"text-green-600":
			BudgetSceneStore.newBudget.amount >= props.budget_disp.spent,
		"text-red-600": BudgetSceneStore.newBudget.amount < props.budget_disp.spent
	});
	return (
		<div className="my-2 bg-white shadow flex justify-between rounded">
			<div className="bg-blue-900 p-6 rounded-l">
				<h2 className="font-semibold text-blue-100 text-lg">
					Edit this budget
				</h2>
				<div className="text-blue-100">
					Begin editing values to see a live preview of your changes
				</div>
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
						<div
							onClick={() => BudgetSceneStore.autobalance()}
							className="text-xs bg-gray-200 pr-2 text-blue-500 hover:text-blue-700 cursor-pointer"
						>
							Autobalance
						</div>
					</div>
				</div>
				<div>Period</div>
				<DateRangePicker
					startDateId="newBudgetStartDate"
					startDate={moment(BudgetSceneStore.newBudget.startDate, "YYYY-MM-DD")}
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
				<div className="flex mt-2">
					<div
						onClick={() => BudgetSceneStore.deleteBudget(UserStore.token)}
						className="text-red-700 text-center mx-auto h-full text-sm font-semibold flex flex-col justify-center"
					>
						<div>DELETE</div>
					</div>
					<div
						onClick={() => BudgetSceneStore.updateBudget(UserStore.token)}
						className={
							buttonColor +
							" text-white text-center mx-auto h-full text-sm font-semibold flex flex-col justify-center"
						}
					>
						<div>SAVE</div>
					</div>
				</div>
			</div>
		</div>
	);
});