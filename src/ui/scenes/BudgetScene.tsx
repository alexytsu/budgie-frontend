import * as React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import * as ReactModal from "react-modal";
import { DateRangePicker } from "react-dates";
import classNames = require("classnames");
import moment = require("moment");

import apiHelpers from "../../util/api-helpers";
import UserStore from "../../stores/UserStore";
import ApplicationStore from "../../stores/ApplicationStore";
import BudgetSceneStore from "../../stores/BudgetSceneStore";

import Budget from "../components/budget/Budget";
import AddNewBudgetModal from "../components/budget/AddNewBudgetModal";
import { TransactionListDateSections } from "../components/transaction/TransactionLists";
import Graph from "../components/graph/Graph";
import {
	CreateBudgetReq,
	BudgetPeriod,
	BudgetDisplayProps,
	BudgetResp
} from "../../util/types/BudgetTypes";
import NetWorthVsBudgetedGraph from "../components/graphs/NetWorthVsBudgetedGraph";
import { SmartEditBudget } from "../components/budget/SmartEditBudget";
import { BudgetList } from "../components/budget/BudgetList";
import { Dashboard } from "../components/budget/Dashboard";

ReactModal.setAppElement("#root");

interface BudgetSceneState {
	selectedBudgetId: number;
	newAmount: number;
}

@observer
export default class BudgetScene extends Component<{}, BudgetSceneState> {
	constructor(props) {
		super(props);

		let firstId = 0;

		if (ApplicationStore.budgets_raw.length > 0) {
			firstId = ApplicationStore.budgets_raw[0].id;
		}

		this.state = {
			selectedBudgetId: firstId,
			newAmount: 0
		};
	}

	componentDidMount() {
		if(ApplicationStore.overbudgetedDays.length > 0) {
			BudgetSceneStore.sceneDatePicker.startDate = ApplicationStore.overbudgetedDays[0].start_date;
			BudgetSceneStore.sceneDatePicker.endDate = ApplicationStore.overbudgetedDays[0].end_date;
		}
	}

	changeHandler = e => {
		const stateCopy = this.state;
		stateCopy[e.target.name] = e.target.value;
		this.setState({ ...stateCopy });
	};

	updateBudget = () => {
		const newBud: CreateBudgetReq = {
			amount: this.state.newAmount,
			category: BudgetSceneStore.currentBudget.category,
			startDate: BudgetSceneStore.currentBudget.startDate,
			endDate: BudgetSceneStore.currentBudget.endDate
		};
		ApplicationStore.updateBudget(
			UserStore.token,
			BudgetSceneStore.selectedBudgetId,
			newBud
		);
	};

	render() {
		const bud = ApplicationStore.budgets_raw.find(
			b => b.id === BudgetSceneStore.selectedBudgetId
		);

		const filterButtonStyle = classNames({
			"p-1 rounded text-white font-semibold": true,
			"bg-green-700": !BudgetSceneStore.sceneDatePicker.filtering,
			"bg-red-700": BudgetSceneStore.sceneDatePicker.filtering,
		})

		return (
			<div className="flex h-full">
				<ReactModal
					isOpen={BudgetSceneStore.modalOpen}
					onRequestClose={() => BudgetSceneStore.closeModal()}
				>
					<AddNewBudgetModal></AddNewBudgetModal>
					<NetWorthVsBudgetedGraph></NetWorthVsBudgetedGraph>
				</ReactModal>
				<div style={{ minWidth: 250 }} className="flex flex-col mr-8">
					<div>
						<h1 className="text-xl mb-4">Budgets</h1>
					</div>
					<AmountBudgetedSummary date={moment()}></AmountBudgetedSummary>
					<div className="my-2 flex">
						<DateRangePicker
							startDate={BudgetSceneStore.sceneDatePicker.startDate}
							startDateId={"sceneStart"}
							endDate={BudgetSceneStore.sceneDatePicker.endDate}
							endDateId={"sceneEnd"}
							focusedInput={BudgetSceneStore.sceneDatePicker.focus}
							onFocusChange={calendarFocus => {
								BudgetSceneStore.sceneDatePicker.focus = calendarFocus;
							}}
							onDatesChange={({ startDate, endDate }) => {
								BudgetSceneStore.sceneDatePicker.startDate = startDate;
								BudgetSceneStore.sceneDatePicker.endDate = endDate;
							}}
							isOutsideRange={() => false}
							numberOfMonths={2}
						></DateRangePicker>
						<button
							className={filterButtonStyle}
							onClick={()=> BudgetSceneStore.sceneDatePicker.filtering = !BudgetSceneStore.sceneDatePicker.filtering}
						>
							Filter
						</button>
					</div>
					<button
						className="p-1 rounded bg-blue-800 text-white my-2 font-semibold"
						onClick={() => BudgetSceneStore.openModal()}
					>
						Manage...
					</button>
					<div style={{maxWidth: 250}} className="overflow-y-scroll h-full mb-4">
						<BudgetList></BudgetList>
					</div>
				</div>
				<div className="w-full h-full ml-8">
					{bud !== undefined ? (
						<Dashboard
							budget={bud}
							budget_disp={apiHelpers.convertBudget(bud)}
						></Dashboard>
					) : null}
				</div>
			</div>
		);
	}
}

const AmountBudgetedSummary = observer((props: { date: moment.Moment }) => {
	return (
		<div className="text-sm rounded border px-2">
			<table className="my-2 table-auto text-right text-sm w-full">
				<thead>
					<tr className="text-gray-700">
						<th className="text-left pb-2">Date</th>
						<th className="pb-2">Budgeted</th>
						<th className="pb-2">Net Worth</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="text-left">Today</td>
						<td>{ApplicationStore.getAmountBudgetdOn(moment())}</td>
						<td>{ApplicationStore.getNetWorthOn(moment())}</td>
					</tr>
					<tr>
						<td className="text-left py-2">Last Month</td>
						<td className="py-2">
							{ApplicationStore.getAmountBudgetdOn(
								moment()
									.subtract(1, "month")
									.startOf("month")
							)}
						</td>
						<td className="py-2">
							{ApplicationStore.getNetWorthOn(
								moment()
									.subtract(1, "month")
									.startOf("month")
							)}
						</td>
					</tr>
					{moment().isSame(props.date, "day") ? null : (
						<tr>
							<td className="text-left py-2">
								Selected Date: {props.date.format("(DD MMM)")}
							</td>
							<td className="py-2">
								{ApplicationStore.getAmountBudgetdOn(moment())}
							</td>
							<td className="py-2">
								{ApplicationStore.getNetWorthOn(moment())}
							</td>
						</tr>
					)}
					{ApplicationStore.overbudgetedDays.map(day => {
						return( <tr key={day.start_date.format()} className="bg-red-300">
							<td className="text-left py-2 font-bold">
								{day.start_date.format("DD MMM")} - {day.end_date.format("DD MMM")}
							</td>
							<td className="py-2">
								{apiHelpers.round(day.budgeted, 2)}
							</td>
							<td className="py-2">
								{apiHelpers.round(day.netWorth, 2)}
							</td>
						</tr>);
					})}
				</tbody>
			</table>
		</div>
	);
});
